import React from 'react';
import ReactDOMServer from 'react-dom/server';

// Components
import Mailto from '../src/react-mailto.js';

// Test utils
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';
import chai, {expect} from 'chai';
import chaiString from 'chai-string';
import jsdom from 'mocha-jsdom';

chai.use(chaiString);

// Helper functions
const shallowRender = (props = {}) => {
    const renderer = ReactTestUtils.createRenderer();
    if (!props.children) {
        renderer.render(<Mailto {...props} />);
    } else {
        const {children, ...otherProps} = props;
        renderer.render(<Mailto {...otherProps}>{children}</Mailto>);
    }
    return renderer.getRenderOutput();
};

const encode = encodeURIComponent;
const event = {
    preventDefault: sinon.spy(),
    stopPropagation: sinon.spy()
};
describe('<Mailto /> component', () => {

    jsdom();

    afterEach(()=>{
        event.preventDefault.reset();
        event.stopPropagation.reset();
    });

    describe('#render', () => {
        it('returns link (<a>)', () => {
            const renderedTree = shallowRender();
            expect(renderedTree.type).to.equal('a');
        });
        it('has cache drop parameter', () => {
            const renderedTree = shallowRender();
            expect(renderedTree.props.href).to.have.string('_c=');
        });
    });

    describe('#props: ', () => {

        describe('*`to` (required)', () => {
            it('as a string', () => {
                const props = {to: 'i@tjrus.com'}
                const renderedTree = shallowRender(props);
                expect(renderedTree.props.href).to.startsWith(`mailto:${props.to}`);
            });

            it('an array of strings', () => {
                const props = {to: ['i@tjrus.com', 'tj@devlio.com']};
                const renderedTree = shallowRender(props);
                expect(renderedTree.props.href).to.startsWith(`mailto:${props.to.join(',')}`);
            });
        });

        describe('`subject`', () => {
            it('as a string', () => {
                const props = {subject: 'some-subject'};
                const renderedTree = shallowRender(props);
                expect(renderedTree.props.href).to.have.string(`subject=${props.subject}`);
            });
            it('encoded properly to be a part of the string', () => {
                const props = {subject: 'some subject'};
                const renderedTree = shallowRender(props);
                expect(renderedTree.props.href).to.have.string(`subject=${encode(props.subject)}`);
            });
            it('not appear in a href parameter when not passed', () => {
                const renderedTree = shallowRender();
                expect(renderedTree.props.href).not.to.have.string('subject');
            });
        });

        describe('`body`', () => {
            it('as a string', () => {
                const props = {body: 'some-body'}
                const renderedTree = shallowRender(props);
                expect(renderedTree.props.href).to.have.string(`body=${props.body}`);
            });
            it('encoded properly to be a part of the string', () => {
                const props = {body: 'some body'}
                const renderedTree = shallowRender(props);
                expect(renderedTree.props.href).to.have.string(`body=${encode(props.body)}`);
            });
            it('not appear in a href parameter when not passed', () => {
                const renderedTree = shallowRender();
                expect(renderedTree.props.href).not.to.have.string('body');
            });
        });

        describe('`cc`', () => {
            it('as a string', () => {
                const props = {cc: 'i@tjrus.com'}
                const renderedTree = shallowRender(props);
                expect(renderedTree.props.href).to.have.string(`cc=${props.cc}`);
            });

            it('an array of strings', () => {
                const props = {cc: ['i@tjrus.com', 'tj@devlio.com']};
                const renderedTree = shallowRender(props);
                expect(renderedTree.props.href).to.have.string(`cc=${props.cc.join(',')}`);
            });
            it('not appear in a href parameter when not passed', () => {
                const renderedTree = shallowRender();
                expect(renderedTree.props.href).not.to.have.string('cc');
            });
        });

        describe('`bcc`', () => {
            it('as a string', () => {
                const props = {bcc: 'i@tjrus.com'}
                const renderedTree = shallowRender(props);
                expect(renderedTree.props.href).to.have.string(`bcc=${props.bcc}`);
            });

            it('an array of strings', () => {
                const props = {bcc: ['i@tjrus.com', 'tj@devlio.com']};
                const renderedTree = shallowRender(props);
                expect(renderedTree.props.href).to.have.string(`bcc=${props.bcc.join(',')}`);
            });
            it('not appear in a href parameter when not passed', () => {
                const renderedTree = shallowRender();
                expect(renderedTree.props.href).not.to.have.string('bcc');
            });
        });

        describe('`secure`', () => {
            it('adds onClick event mailto handler to hide real emails', () => {
                const renderedTree = shallowRender({secure: true});
                expect(renderedTree.props.href).to.equal('javascript:void(0)');
                renderedTree.props.onClick.call(null, event);
                expect(renderedTree.props.onClick).to.be.a('function');
            });
            it('if onClick also was a passed property - new handler will call it before handling mailto', () => {
                const onClick = sinon.spy();
                const renderedTree = shallowRender({secure: true, onClick});
                renderedTree.props.onClick.call(null, event);
                expect(renderedTree.props.onClick).to.be.a('function');
            });

            it('onClick preventing event default behaviour', () => {
                const onClick = sinon.spy();
                const renderedTree = shallowRender({secure: true, onClick});
                renderedTree.props.onClick.call(null, event);
                expect(event.preventDefault.calledOnce).to.be.true;
            });
            it('onClick doesn\'t stop propagating event', () => {
                const onClick = sinon.spy();
                const renderedTree = shallowRender({secure: true, onClick});
                renderedTree.props.onClick.call(null, event);
                expect(event.stopPropagation.called).to.be.false;
            })
        });

        describe('children', () => {
            it('should be passed as a link text', () => {
                const children = 'link text';
                const renderedTree = shallowRender({children});
                expect(renderedTree.props.children).to.equal(children);
            });
        })

    });
});
