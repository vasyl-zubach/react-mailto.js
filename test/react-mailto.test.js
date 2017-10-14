// Component
import Mailto from '../src/react-mailto';

// Test Utills
import { shallow } from 'enzyme';

const shallowRender = (props = {}) => {
    const {children, ...otherProps} = props;
    return shallow(<Mailto {...otherProps}>{children}</Mailto>);
};

const encode = encodeURIComponent;
const sandbox = sinon.sandbox.create();
const event = {
    preventDefault: sandbox.stub(),
    stopPropagation: sandbox.stub()
};

beforeEach(() => {
    sandbox.reset();
})

describe('<Mailto /> component', () => {

    describe('#render', () => {
        it('returns link (<a>)', () => {
            const renderedTree = shallowRender();
            expect(renderedTree.type()).to.equal('a');
        });
        it('has cache drop parameter', () => {
            const renderedTree = shallowRender();
            expect(renderedTree.props().href).to.have.string('_c=');
        });
    });

    describe('#props: ', () => {
        describe('*`to` (required)', () => {
            it('as a string', () => {
                const props = {to: 'i@tjrus.com'}
                const renderedTree = shallowRender(props);
                expect(renderedTree.prop('href')).to.startsWith(`mailto:${props.to}`);
            });

            it('an array of strings', () => {
                const props = {to: ['i@tjrus.com', 'tj@devlio.com']};
                const renderedTree = shallowRender(props);
                expect(renderedTree.prop('href')).to.startsWith(`mailto:${props.to.join(',')}`);
            });
        });

        describe('`subject`', () => {
            it('as a string', () => {
                const props = {subject: 'some-subject'};
                const renderedTree = shallowRender(props);
                expect(renderedTree.prop('href')).to.have.string(`subject=${props.subject}`);
            });
            it('encoded properly to be a part of the string', () => {
                const props = {subject: 'some subject'};
                const renderedTree = shallowRender(props);
                expect(renderedTree.prop('href')).to.have.string(`subject=${encode(props.subject)}`);
            });
            it('not appear in a href parameter when not passed', () => {
                const renderedTree = shallowRender();
                expect(renderedTree.prop('href')).not.to.have.string('subject');
            });
        });

        describe('`body`', () => {
            it('as a string', () => {
                const props = {body: 'some-body'}
                const renderedTree = shallowRender(props);
                expect(renderedTree.prop('href')).to.have.string(`body=${props.body}`);
            });
            it('encoded properly to be a part of the string', () => {
                const props = {body: 'some body'}
                const renderedTree = shallowRender(props);
                expect(renderedTree.prop('href')).to.have.string(`body=${encode(props.body)}`);
            });
            it('not appear in a href parameter when not passed', () => {
                const renderedTree = shallowRender();
                expect(renderedTree.prop('href')).not.to.have.string('body');
            });
        });

        describe('`cc`', () => {
            it('as a string', () => {
                const props = {cc: 'i@tjrus.com'}
                const renderedTree = shallowRender(props);
                expect(renderedTree.prop('href')).to.have.string(`cc=${props.cc}`);
            });

            it('an array of strings', () => {
                const props = {cc: ['i@tjrus.com', 'tj@devlio.com']};
                const renderedTree = shallowRender(props);
                expect(renderedTree.prop('href')).to.have.string(`cc=${props.cc.join(',')}`);
            });
            it('not appear in a href parameter when not passed', () => {
                const renderedTree = shallowRender();
                expect(renderedTree.prop('href')).not.to.have.string('cc');
            });
        });

        describe('`bcc`', () => {
            it('as a string', () => {
                const props = {bcc: 'i@tjrus.com'}
                const renderedTree = shallowRender(props);
                expect(renderedTree.prop('href')).to.have.string(`bcc=${props.bcc}`);
            });

            it('an array of strings', () => {
                const props = {bcc: ['i@tjrus.com', 'tj@devlio.com']};
                const renderedTree = shallowRender(props);
                expect(renderedTree.prop('href')).to.have.string(`bcc=${props.bcc.join(',')}`);
            });
            it('not appear in a href parameter when not passed', () => {
                const renderedTree = shallowRender();
                expect(renderedTree.prop('href')).not.to.have.string('bcc');
            });
        });

        describe('`onClick`', () => {
            it('should be triggered when link is clicked', () => {
                let testVar = 0;
                const onClick = () => testVar++;
                const renderedTree = shallowRender({ onClick });
                renderedTree.prop('onClick').call(null, event);
                expect(renderedTree.prop('onClick')).to.be.a('function');
                expect(testVar).to.equal(1);
            })
        });

        describe('`secure`', () => {
            it('adds onClick event mailto handler to hide real emails', () => {
                const renderedTree = shallowRender({secure: true});
                expect(renderedTree.prop('href')).to.equal('javascript:void(0)');
                renderedTree.prop('onClick').call(null, event);
                expect(renderedTree.prop('onClick')).to.be.a('function');
            });
            it('if onClick also was a passed property - new handler will call it before handling mailto', () => {
                const onClick = sinon.stub();
                const renderedTree = shallowRender({secure: true, onClick});
                renderedTree.prop('onClick').call(null, event);
                expect(renderedTree.prop('onClick')).to.be.a('function');
            });

            it('onClick preventing event default behaviour', () => {
                const onClick = sinon.stub();
                const renderedTree = shallowRender({secure: true, onClick});
                renderedTree.prop('onClick').call(null, event);
                expect(event.preventDefault).to.have.callCount(1);
            });
            it('onClick doesn\'t stop propagating event', () => {
                const onClick = sinon.stub();
                const renderedTree = shallowRender({secure: true, onClick});
                renderedTree.prop('onClick').call(null, event);
                expect(event.stopPropagation).to.have.callCount(0);
            })
        });

        describe('children', () => {
            it('should be passed as a link text', () => {
                const children = 'link text';
                const renderedTree = shallowRender({children});
                expect(renderedTree.prop('children')).to.equal(children);
            });
        })
    });
});
