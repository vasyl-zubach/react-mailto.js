import React from 'react';
// Component
import Mailto, { Props } from '../src';

// Test Utills
import { shallow } from 'enzyme';

jest.mock('window-or-global', () => ({
  __esModule: true,
  default: {
    encodeURIComponent: encodeURIComponent,
    location: {
      assign: jest.fn()
    }
  }
}));

const event = {
  preventDefault: jest.fn(),
  stopPropagation: jest.fn()
};

const defaultProps = {
  to: 'test@example.com'
};

const shallowRender = (props: Partial<Props> = {}) =>
  shallow(
    <Mailto {...defaultProps} {...props}>
      {props.children || 'The link'}
    </Mailto>
  );

const encode = encodeURIComponent;

describe('#render', () => {
  it('returns link (<a>)', () => {
    const renderedTree = shallowRender();
    expect(renderedTree.type()).toEqual('a');
  });
  it('has cache drop parameter', () => {
    const renderedTree = shallowRender();
    expect(renderedTree.props().href).toContain('_c=');
  });
});

describe('#props: ', () => {
  describe('`to` (required)', () => {
    it('as a string', () => {
      const props = { to: 'i@tjrus.com' };
      const renderedTree = shallowRender(props);
      expect(renderedTree.prop('href').startsWith(`mailto:${props.to}`)).toBe(
        true
      );
    });

    it('an array of strings', () => {
      const props = { to: ['i@tjrus.com', 'tj@devlio.com'] };
      const renderedTree = shallowRender(props);
      expect(
        renderedTree.prop('href').startsWith(`mailto:${props.to.join(',')}`)
      ).toBe(true);
    });
  });

  describe('`subject`', () => {
    it('as a string', () => {
      const props = { subject: 'some-subject' };
      const renderedTree = shallowRender(props);
      expect(renderedTree.prop('href')).toContain(`subject=${props.subject}`);
    });
    it('encoded properly to be a part of the string', () => {
      const props = { subject: 'some subject' };
      const renderedTree = shallowRender(props);
      expect(renderedTree.prop('href')).toContain(
        `subject=${encode(props.subject)}`
      );
    });
    it('not appear in a href parameter when not passed', () => {
      const renderedTree = shallowRender();
      expect(renderedTree.prop('href')).not.toContain('subject');
    });
  });

  describe('`body`', () => {
    it('as a string', () => {
      const props = { body: 'some-body' };
      const renderedTree = shallowRender(props);
      expect(renderedTree.prop('href')).toContain(`body=${props.body}`);
    });
    it('encoded properly to be a part of the string', () => {
      const props = { body: 'some body' };
      const renderedTree = shallowRender(props);
      expect(renderedTree.prop('href')).toContain(`body=${encode(props.body)}`);
    });
    it('not appear in a href parameter when not passed', () => {
      const renderedTree = shallowRender();
      expect(renderedTree.prop('href')).not.toContain('body');
    });
  });

  describe('`cc`', () => {
    it('as a string', () => {
      const props = { cc: 'i@tjrus.com' };
      const renderedTree = shallowRender(props);
      expect(renderedTree.prop('href')).toContain(`cc=${props.cc}`);
    });

    it('an array of strings', () => {
      const props = { cc: ['i@tjrus.com', 'tj@devlio.com'] };
      const renderedTree = shallowRender(props);
      expect(renderedTree.prop('href')).toContain(`cc=${props.cc.join(',')}`);
    });
    it('not appear in a href parameter when not passed', () => {
      const renderedTree = shallowRender();
      expect(renderedTree.prop('href')).not.toContain('cc');
    });
  });

  describe('`bcc`', () => {
    it('as a string', () => {
      const props = { bcc: 'i@tjrus.com' };
      const renderedTree = shallowRender(props);
      expect(renderedTree.prop('href')).toContain(`bcc=${props.bcc}`);
    });

    it('an array of strings', () => {
      const props = { bcc: ['i@tjrus.com', 'tj@devlio.com'] };
      const renderedTree = shallowRender(props);
      expect(renderedTree.prop('href')).toContain(`bcc=${props.bcc.join(',')}`);
    });
    it('not appear in a href parameter when not passed', () => {
      const renderedTree = shallowRender();
      expect(renderedTree.prop('href')).not.toContain('bcc');
    });
  });

  describe('`onClick`', () => {
    it('should be triggered when link is clicked', () => {
      let testVar = 0;
      const onClick = () => testVar++;
      const renderedTree = shallowRender({ onClick });
      renderedTree.prop('onClick').call(null, event);
      expect(typeof renderedTree.prop('onClick')).toEqual('function');
      expect(testVar).toBe(1);
    });
  });

  describe('`secure`', () => {
    it('adds onClick event mailto handler to hide real emails', () => {
      const renderedTree = shallowRender({ secure: true });
      expect(renderedTree.prop('href')).toEqual('javascript:void(0)');
      renderedTree.prop('onClick')(event);
      expect(typeof renderedTree.prop('onClick')).toBe('function');
    });
    it('if onClick also was a passed property - new handler will call it before handling mailto', () => {
      const onClick = jest.fn();
      const renderedTree = shallowRender({ secure: true, onClick });
      renderedTree.prop('onClick')(event);
      expect(typeof renderedTree.prop('onClick')).toBe('function');
    });

    it('onClick preventing event default behaviour', () => {
      const onClick = jest.fn();
      const renderedTree = shallowRender({ secure: true, onClick });
      renderedTree.prop('onClick')(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });

    it("onClick doesn't stop propagating event", () => {
      const onClick = jest.fn();
      const renderedTree = shallowRender({ secure: true, onClick });
      renderedTree.prop('onClick').call(null, event);
      expect(event.stopPropagation).toHaveBeenCalledTimes(0);
    });
  });

  describe('children', () => {
    it('should be passed as a link text', () => {
      const children = 'link text';
      const renderedTree = shallowRender({ children });
      expect(renderedTree.prop('children')).toEqual(children);
    });
  });
});
