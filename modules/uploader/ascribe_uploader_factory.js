import React from 'react';

import { deepMatchObject, safeInvoke } from 'js-utility-belt/es6';

import CustomHeaderOnChangeUploader from 'react-utility-belt/es6/uploader/extended_uploaders/custom_header_on_change_uploader';
import CustomValidationUploader from 'react-utility-belt/es6/uploader/extended_uploaders/custom_validation_uploader';
import FileHashUploader from 'react-utility-belt/es6/uploader/extended_uploaders/file_hash_uploader';
import ReactS3FineUploader from 'react-utility-belt/es6/uploader/react_s3_fine_uploader';
import UploaderSupportedFeatures from 'react-utility-belt/es6/uploader/constants/supported_features';
import uploaderSpecExtender from 'react-utility-belt/es6/uploader/utils/uploader_spec_extender';

import AscribeBlobUploader from './extended_uploaders/ascribe_blob_uploader';
import AscribeRequestKeyUploader from './extended_uploaders/ascribe_request_key_uploader';

import { uploaderCreateBlobParamsShape, uploaderRequestKeyParamsShape } from '../prop_types';


const { func } = React.PropTypes;


const AscribeUploaderFactory = ({
    createCsrfHeader,
    request,
    Urls,
    S3_ACCESS_KEY,
    S3_ACL = 'public-read',
    S3_BUCKET,
    S3_UPLOAD_ENDPOINT
}) => {
    // Create the uploader by adding blob, request key, custom header, and validation functionality to
    // ReactS3FineUploader
    const UploaderEnhancements = [
        CustomValidationUploader,
        CustomHeaderOnChangeUploader,
        AscribeBlobUploader,
        AscribeRequestKeyUploader
    ];
    const EnhancedUploader = UploaderEnhancements.reduce(
        // Add a request to each of the extended uploaders in case they need network access
        (Uploader, Enhancer) => Enhancer(Uploader, request),
        ReactS3FineUploader
    );

    return React.createClass(uploaderSpecExtender({
        displayName: 'AscribeUploader',

        propTypes: {
            // AscribeBlobUploader props
            createBlobParams: uploaderCreateBlobParamsShape,
            onCreateBlobError: func,
            onCreateBlobSuccess: func,

            // AscribeRequestKeyUploader props
            // eslint-disable-next-line react/sort-prop-types
            onRequestKeySuccess: func.isRequired,
            requestKeyParams: uploaderRequestKeyParamsShape.isRequired,

            onRequestKeyError: func,

            // CustomHeaderOnChangeUploader props
            shouldCustomHeaderChange: func

            // All other props are passed through to ReactS3FineUploader
        },

        getDefaultProps() {
            const { result: csrfHeader } = safeInvoke(createCsrfHeader);

            return {
                shouldCustomHeaderChange: this.shouldCustomHeaderChange,

                // FineUploader options
                autoUpload: true,
                chunking: {
                    enabled: true,
                    concurrent: {
                        enabled: true
                    }
                },
                cors: {
                    expected: true,
                    sendCredentials: true
                },
                deleteFile: {
                    enabled: true,
                    method: 'DELETE',
                    endpoint: Urls.S3_DELETE,
                    customHeaders: csrfHeader
                },
                formatFileName: (name) => (
                    name && name.length > 30 ? `${name.slice(0, 15)}...${name.slice(-15)}` : name
                ),
                messages: {},
                objectProperties: {
                    acl: S3_ACL,
                    bucket: S3_BUCKET
                },
                request: {
                    accessKey: S3_ACCESS_KEY,
                    endpoint: S3_UPLOAD_ENDPOINT
                },
                resume: {
                    enabled: true
                },
                retry: {
                    enableAuto: false
                },
                session: {
                    endpoint: null
                },
                uploadSuccess: {
                    params: {
                        isBrowserPreviewCapable: UploaderSupportedFeatures.imagePreviews
                    }
                }
            };
        },

        shouldCustomHeaderChange(currentHeaders) {
            const { result: currentCsrfHeader } = safeInvoke(createCsrfHeader);
            const newHeaders = {};

            ['delete', 'request'].forEach((headerKey) => {
                const currentHeader = currentHeaders[headerKey];

                // Use deepMatchObject to check if the header has the csrf header and whether its
                // value is the same as the current csrf token
                if (!currentHeader || !deepMatchObject(currentHeader, currentCsrfHeader)) {
                    newHeaders[headerKey] = {
                        ...currentHeader,
                        ...currentCsrfHeader
                    };
                }
            });

            return newHeaders;
        },

        render() {
            return (<EnhancedUploader ref="uploader" {...this.props} />);
        }
    }));
};

// Also export version with file hashing
const AscribeFileHashUploaderFactory = (...args) => (
    FileHashUploader(AscribeFileHashUploaderFactory(...args))
);

export default AscribeUploaderFactory;
export {
    AscribeUploaderFactory,
    AscribeFileHashUploaderFactory
};
