import React from 'react';

import CreateBlobUploader from 'react-utility-belt/es6/uploader/extended_uploaders/create_blob_uploader';
import uploaderSpecExtender from 'react-utility-belt/es6/uploader/utils/uploader_spec_extender';

import { uploaderCreateBlobParamsShape } from '../../prop_types';


const { func } = React.PropTypes;

const AscribeBlobUploader = (Uploader, request) => {
    const BlobUploader = CreateBlobUploader(Uploader);

    return React.createClass(uploaderSpecExtender({
        displayName: 'AscribeBlobUploader',

        propTypes: {
            createBlobParams: uploaderCreateBlobParamsShape,
            onCreateBlobError: func,
            onCreateBlobSuccess: func

            // All other props are passed unmodified to backing Uploader
        },

        handleBlobCreation(file) {
            const { createBlobParams, onCreateBlobError, onCreateBlobSuccess } = this.props;

            // If createBlobParams is not defined, progress right away without posting to S3 to let
            // this be done later by another component
            if (!createBlobParams) {
                if (process.env.NODE_ENV !== 'production') {
                    // Still we warn the user of this component during development
                    // eslint-disable-next-line no-console
                    console.warn('createBlobParams was not defined for AscribeBlobUploader. ' +
                                 'Continuing without creating the blob on the server.');
                }
                return Promise.resolve();
            }

            return request(createBlobParams.url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...createBlobParams.headers
                },
                body: JSON.stringify({
                    'filename': file.name,
                    'key': file.key,
                    ...createBlobParams.body
                })
            })
            .then((res) => onCreateBlobSuccess(res, file))
            .catch((err) => onCreateBlobError(err, file));
        },

        render() {
            const {
                createBlobParams: ignoredCreateBlobParams, // ignore
                onCreateBlobError: ignoredOnCreateBlobError, // ignore
                onCreateBlobSuccess: ignoredOnCreateBlobSuccess, // ignore
                ...uploaderProps
            } = this.props;

            return (
                <BlobUploader
                    ref="uploader"
                    {...uploaderProps}
                    handleBlobCreation={this.handleBlobCreation} />
            );
        }
    }));
};

export default AscribeBlobUploader;
