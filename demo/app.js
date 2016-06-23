/* eslint-disable no-alert, no-console */
/* eslint-disable import/no-extraneous-dependencies */

import 'bootstrap-loader';

import React from 'react';
import ReactDOM from 'react-dom';

import {
    createFormForPropertyTypes,
    InputCheckbox,
    InputDate,
    InputTextarea,
} from 'react-utility-belt/es6/form';
import { Grouping } from 'react-utility-belt/es6/ui';

import { Button } from '../modules/buttons';
import { CollapsibleCheckboxProperty, CollapsibleProperty } from '../modules/form';

import './app.scss';


const AscribeRCForm = createFormForPropertyTypes(CollapsibleCheckboxProperty, CollapsibleProperty);

// TODO: turn this into a nicely formatted styleguide
const App = () => (
    <div>
        <marquee direction="right">
            Well, this could certainly be made better, ideally we'd have an auto-generated
            styleguide or something... but for now you can enjoy this
        </marquee>
        <h2>Buttons</h2>
        <h3>Primary Button</h3>
        <div>
            <Button>Primary</Button>
            <Button className="active focus">Primary Active</Button>
            <Button disabled>Primary Disabled</Button>
            <Button size="xs">Primary XS</Button>
            <Button size="sm">Primary SM</Button>
            <Button size="lg">Primary LG</Button>
            <Button href="http://www.google.com" size="lg">Primary LG Anchor</Button>
            <div>
                <Button wide>Primary Wide</Button>
            </div>
        </div>
        <h3>Secondary Button</h3>
        <div>
            <Button classType="secondary">Secondary</Button>
            <Button className="active focus" classType="secondary">Secondary Active</Button>
            <Button disabled classType="secondary">Secondary Disabled</Button>
            <Button classType="secondary" size="xs">Secondary XS</Button>
            <Button classType="secondary" size="sm">Secondary SM</Button>
            <Button classType="secondary" size="lg">Secondary LG</Button>
            <Button classType="secondary" href="http://www.google.com" size="lg">Primary LG Anchor</Button>
            <div>
                <Button wide classType="secondary">Secondary Wide</Button>
            </div>
        </div>
        <h3>Tertiary Button</h3>
        <div>
            <Button classType="tertiary">Tertiary</Button>
            <Button className="active focus" classType="tertiary">Tertiary Active</Button>
            <Button disabled classType="tertiary">Tertiary Disabled</Button>
            <Button classType="tertiary" size="xs">Tertiary XS</Button>
            <Button classType="tertiary" size="sm">Tertiary SM</Button>
            <Button classType="tertiary" size="lg">Tertiary LG</Button>
            <Button classType="tertiary" href="http://www.google.com" size="lg">Primary LG Anchor</Button>
            <div>
                <Button wide classType="tertiary">Tertiary Wide</Button>
            </div>
        </div>
        <h3>Button Grouping</h3>
        <div>
            <Grouping>
                <Button>Button 1</Button>
                <Button classType="secondary">Button 2</Button>
                <Button classType="tertiary">Button 3</Button>
            </Grouping>
        </div>
        <h4>Pulled right</h4>
        <div>
            <div className="clearfix">
                <Grouping className="pull-right">
                    <Button>Button 1</Button>
                    <Button classType="secondary">Button 2</Button>
                    <Button classType="tertiary">Button 3</Button>
                </Grouping>
            </div>
        </div>
        <h4>Vertical</h4>
        <div>
            <Grouping vertical>
                <Button>Button 1</Button>
                <Button classType="secondary">Button 2</Button>
                <Button classType="tertiary">Button 3</Button>
            </Grouping>
        </div>
        <h4>Vertical pulled right</h4>
        <div>
            <div className="clearfix">
                <Grouping vertical className="pull-right">
                    <Button>Button 1</Button>
                    <Button classType="secondary">Button 2</Button>
                    <Button classType="tertiary">Button 3</Button>
                </Grouping>
            </div>
        </div>
        <h4>Anchor buttons</h4>
        <div>
            <Grouping>
                <Button href="http://www.google.com">Button 1</Button>
                <Button classType="secondary" href="http://www.google.com">Button 2</Button>
                <Button classType="tertiary" href="http://www.google.com">Button 3</Button>
            </Grouping>
        </div>
        <h2>Forms</h2>
        <h3>Collapsible Properties</h3>
        <div>
            <AscribeRCForm
                onSubmit={(data) => {
                    console.log(data);
                    return Promise.resolve();
                }}>
                <CollapsibleProperty
                    headerLabel="expanded prop"
                    label="Expanded label"
                    name="expanded">
                    <input placeholder="expanded placeholder" type="text" />
                </CollapsibleProperty>
                <CollapsibleProperty
                    expanded={false}
                    headerLabel="collapsed prop"
                    label="Collapsed label"
                    name="collapsed">
                    <input placeholder="collapsed placeholder" type="text" />
                </CollapsibleProperty>
                <CollapsibleCheckboxProperty
                    checked
                    checkboxLabel="checked prop"
                    label="Checked prop label"
                    name="checked">
                    <input placeholder="checked placeholder" type="text" />
                </CollapsibleCheckboxProperty>
                <CollapsibleCheckboxProperty
                    checkboxLabel="unchecked prop"
                    label="Unchecked prop label"
                    name="unchecked">
                    <input placeholder="unchecked placeholder" type="text" />
                </CollapsibleCheckboxProperty>
                <CollapsibleCheckboxProperty
                    checked
                    disabled
                    checkboxLabel="disabled prop"
                    defaultValue="disabled"
                    label="disabled prop label"
                    name="disabled">
                    <input placeholder="disabled placeholder" type="text" />
                </CollapsibleCheckboxProperty>
            </AscribeRCForm>
        </div>
        <h3>Custom Inputs with Collapsible Properties</h3>
        <div>
            <AscribeRCForm
                onSubmit={(data) => {
                    console.log(data);
                    return Promise.resolve();
                }}>
                <CollapsibleCheckboxProperty
                    checkboxLabel="checkbox"
                    label="checkbox label"
                    name="checkbox">
                    <InputCheckbox label="checkbox" />
                </CollapsibleCheckboxProperty>
                <CollapsibleCheckboxProperty
                    defaultChecked
                    checkboxLabel="default checkbox"
                    label="default checkbox label"
                    name="defaultCheckbox">
                    <InputCheckbox label="defaultCheckbox" />
                </CollapsibleCheckboxProperty>
                <CollapsibleCheckboxProperty
                    checkboxLabel="required checkbox"
                    label="required checkbox label"
                    name="requiredCheckbox">
                    <InputCheckbox required label="required checkbox" />
                </CollapsibleCheckboxProperty>
                <CollapsibleCheckboxProperty
                    checkboxLabel="date"
                    label="date label"
                    name="date">
                    <InputDate />
                </CollapsibleCheckboxProperty>
                <CollapsibleCheckboxProperty
                    checkboxLabel="default date"
                    defaultValue="2010-01-01"
                    label="default date label"
                    name="default Date">
                    <InputDate />
                </CollapsibleCheckboxProperty>
                <CollapsibleCheckboxProperty
                    checkboxLabel="textarea"
                    label="textarea label"
                    name="textarea">
                    <InputTextarea placeholder="textarea" rows={2} />
                </CollapsibleCheckboxProperty>
                <CollapsibleCheckboxProperty
                    checkboxLabel="default textarea"
                    defaultValue="default"
                    label="default textarea label"
                    name="defaulttextarea">
                    <InputTextarea rows={2} />
                </CollapsibleCheckboxProperty>
                <CollapsibleCheckboxProperty
                    disabled
                    checkboxLabel="disabled textarea"
                    defaultValue="disabled"
                    label="disabled textarea label"
                    name="disabledtextarea">
                    <InputTextarea rows={2} />
                </CollapsibleCheckboxProperty>
            </AscribeRCForm>
        </div>
    </div>
);

ReactDOM.render((<App />), document.getElementById('demo-app'));
