import React from 'react';
import { describe, expect, test } from '@jest/globals';
import renderer from 'react-test-renderer';
import window from 'window-or-global';

// Component
import Mailto, { Props } from '../src/index';

const event = {
  preventDefault: jest.fn(),
  stopPropagation: jest.fn()
};

const defaultProps = {
  to: 'test@example.com'
};

const doRender = (props: Partial<Props> = {}) =>
  renderer.create(
    <Mailto {...defaultProps} {...props}>
      {props.children || 'The link'}
    </Mailto>
  );

const encode = encodeURIComponent;

jest.mock('window-or-global', () => ({
  __esModule: true,
  default: {
    encodeURIComponent,
    location: {
      assign: jest.fn()
    }
  }
}));

jest.useFakeTimers({ now: 123456789000 });

describe('#render', () => {
  test('returns link (<a>)', () => {
    const el = doRender();
    expect(el.toJSON().type).toBe('a');
  });
  test('has cache drop parameter', () => {
    const el = doRender();
    expect(el.toJSON().props.href).toContain('_c=');
  });
});

describe('#props: ', () => {
  describe('`to` (required)', () => {
    test('as a string', () => {
      const props = { to: 'vasyl@zubach.com' };
      const renderedTree = doRender(props).toJSON();
      expect(renderedTree.props.href.startsWith(`mailto:${props.to}`)).toBe(
        true
      );
    });

    test('an array of strings', () => {
      const props = { to: ['vasyl@zubach.com', 'example@zubach.com'] };
      const renderedTree = doRender(props).toJSON();
      expect(
        renderedTree.props.href.startsWith(`mailto:${props.to.join(',')}`)
      ).toBe(true);
    });
  });

  describe('`subject`', () => {
    test('as a string', () => {
      const props = { subject: 'some-subject' };
      const renderedTree = doRender(props).toJSON();
      expect(renderedTree.props.href).toContain(`subject=${props.subject}`);
    });
    test('encoded properly to be a part of the string', () => {
      const props = { subject: 'some subject' };
      const renderedTree = doRender(props).toJSON();
      expect(renderedTree.props.href).toContain(
        `subject=${encode(props.subject)}`
      );
    });
    test('not appear in a href parameter when not passed', () => {
      const renderedTree = doRender().toJSON();
      expect(renderedTree.props.href).not.toContain('subject');
    });
  });

  describe('`body`', () => {
    test('as a string', () => {
      const props = { body: 'some-body' };
      const renderedTree = doRender(props).toJSON();
      expect(renderedTree.props.href).toContain(`body=${props.body}`);
    });
    test('encoded properly to be a part of the string', () => {
      const props = { body: 'some body' };
      const renderedTree = doRender(props).toJSON();
      expect(renderedTree.props.href).toContain(`body=${encode(props.body)}`);
    });
    test('not appear in a href parameter when not passed', () => {
      const renderedTree = doRender().toJSON();
      expect(renderedTree.props.href).not.toContain('body');
    });
  });

  describe('`cc`', () => {
    test('as a string', () => {
      const props = { cc: 'vasyl@zubach.com' };
      const renderedTree = doRender(props).toJSON();
      expect(renderedTree.props.href).toContain(`cc=${props.cc}`);
    });

    test('an array of strings', () => {
      const props = { cc: ['vasyl@zubach.com', 'example@zubach.com'] };
      const renderedTree = doRender(props).toJSON();
      expect(renderedTree.props.href).toContain(`cc=${props.cc.join(',')}`);
    });
    test('not appear in a href parameter when not passed', () => {
      const renderedTree = doRender().toJSON();
      expect(renderedTree.props.href).not.toContain('cc');
    });
  });

  describe('`bcc`', () => {
    test('as a string', () => {
      const props = { bcc: 'vasyl@zubach.com' };
      const renderedTree = doRender(props).toJSON();
      expect(renderedTree.props.href).toContain(`bcc=${props.bcc}`);
    });

    test('an array of strings', () => {
      const props = { bcc: ['vasyl@zubach.com', 'example@zubach.com'] };
      const renderedTree = doRender(props).toJSON();
      expect(renderedTree.props.href).toContain(`bcc=${props.bcc.join(',')}`);
    });
    test('not appear in a href parameter when not passed', () => {
      const renderedTree = doRender().toJSON();
      expect(renderedTree.props.href).not.toContain('bcc');
    });
  });

  describe('`onClick`', () => {
    test('should be triggered when link is clicked', () => {
      const onClick = jest.fn();
      const renderedTree = doRender({ onClick }).toJSON();
      renderedTree.props.onClick.call(null, event);
      expect(onClick).toBeCalledTimes(1);
    });
  });

  describe('`secure`', () => {
    test('adds onClick event mailto handler to hide real emails', () => {
      const renderedTree = doRender({ secure: true }).toJSON();
      expect(renderedTree.props.href).toEqual('');
      renderedTree.props.onClick(event);
      expect(window.location.assign).toBeCalledTimes(1);
      expect(window.location.assign).toBeCalledWith(
        'mailto:test@example.com?&_c=123456789000'
      );
    });

    test('if onClick also was a passed property - new handler will call it before handling mailto', () => {
      const onClick = jest.fn();
      const renderedTree = doRender({ secure: true, onClick }).toJSON();
      renderedTree.props.onClick(event);
      expect(window.location.assign).toBeCalledTimes(1);
      expect(window.location.assign).toBeCalledWith(
        'mailto:test@example.com?&_c=123456789000'
      );

      expect(onClick).toBeCalledTimes(1);
      expect(onClick).toBeCalledWith(event);
    });

    test('onClick preventing event default behaviour', () => {
      const onClick = jest.fn();
      const renderedTree = doRender({ secure: true, onClick }).toJSON();
      renderedTree.props.onClick(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });

    test("onClick doesn't stop propagating event", () => {
      const onClick = jest.fn();
      const renderedTree = doRender({ secure: true, onClick }).toJSON();
      renderedTree.props.onClick.call(null, event);
      expect(event.stopPropagation).toHaveBeenCalledTimes(0);
    });
  });

  describe('children', () => {
    test('should be passed as a link text', () => {
      const children = 'link text';
      const renderedTree = doRender({ children }).toJSON();
      expect(renderedTree.children[0]).toBe(children);
    });
  });
});
