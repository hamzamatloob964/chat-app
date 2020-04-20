import Login from  '../components/login'
import HelloWorld from '../components/HelloWorld'
import React from 'react'
import {shallow, mount} from 'enzyme';

describe('My Test Suite', () => {
  it('My Test Case', () => {
    const wrapper = <HelloWorld/>
    // const wrapper = shallow(<HelloWorld/>)
    // const result = wrapper.instance().
    console.log("result is :",wrapper)
    expect(6).toEqual(6);
  });
});