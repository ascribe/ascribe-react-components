import React from 'react';


const { object, shape, string } = React.PropTypes;

const uploaderCreateBlobParamsShapeSpec = {
    body: object,
    headers: object,
    url: string.isRequired
};

export default shape(uploaderCreateBlobParamsShapeSpec);
export {
    uploaderCreateBlobParamsShapeSpec
};
