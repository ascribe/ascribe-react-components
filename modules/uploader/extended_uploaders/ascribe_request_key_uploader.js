import React from 'react';

import uploaderSpecExtender from 'react-utility-belt/es6/uploader/utils/uploader_spec_extender';
import { safeInvoke } from 'js-utility-belt/es6';

import { uploaderRequestKeyParamsShape } from '../../prop_types';


const { func, object } = React.PropTypes;

const AscribeRequestKeyUploader = (Uploader, request) => (
    React.createClass(uploaderSpecExtender({
        displayName: 'AscribeRequestKeyUploader',

        propTypes: {
            // FIXME: write documentation:
            // Requires you to return key from response
            onRequestKeySuccess: func.isRequired,

            requestKeyParams: uploaderRequestKeyParamsShape.isRequired,

            onRequestKeyError: func,

            // FineUploader option that contains the key as a string or function.
            // If the key is already set, don't override it, but if not, provide one that will call
            // `requestKeyParams.url` to get the key.
            objectProperties: object // eslint-disable-line react/sort-prop-types

            // All other props are passed unmodified to backing Uploader
        },

        requestKey(fileId) {
            const { onRequestKeyError, onRequestKeySuccess, requestKeyParams } = this.props;
            const file = this.refs.uploader.getFiles()[fileId];

            return request(requestKeyParams.url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...requestKeyParams.headers
                },
                body: JSON.stringify({
                    filename: file.name,
                    uuid: file.uuid,
                    ...requestKeyParams.body
                })
            })
            .then(onRequestKeySuccess)
            .catch((err) => {
                safeInvoke(onRequestKeyError, err);

                // Rethrow the error to tell FineUploader the key request failed
                throw err;
            });
        },

        render() {
            const { objectProperties } = this.props;
            const {
                onRequestKeyError: ignoredOnRequestKeyError, // ignore
                onRequestKeySuccess: ignoredOnRequestKeySuccess, // ignore
                requestKeyParams: ignoredRequestKeyParams, // ignore
                ...uploaderProps
            } = this.props;

            let uploaderPropsWithObjectKey = uploaderProps;
            if (!objectProperties || !objectProperties.hasOwnProperty('key')) {
                uploaderPropsWithObjectKey = Object.assign({}, uploaderProps, {
                    objectProperties: {
                        ...objectProperties,
                        key: this.requestKey
                    }
                });
            }

            return (<Uploader ref="uploader" {...uploaderPropsWithObjectKey} />);
        }
    }))
);

export default AscribeRequestKeyUploader;
