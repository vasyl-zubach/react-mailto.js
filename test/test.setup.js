import React from 'react';
import { configure } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import chai from 'chai';
import chaiString from 'chai-string';

import sinon from 'sinon';
import chaiSinon from 'sinon-chai';

configure({ adapter: new Adapter() });

chai.use(chaiString);
chai.use(chaiSinon);

global.jestExpect = global.expect;
global.expect = chai.expect;
global.sinon = sinon;
global.React = React;
