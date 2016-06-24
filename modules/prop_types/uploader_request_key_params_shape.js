import React from 'react';


const { object, shape, string } = React.PropTypes;

const uploaderRequestKeyParamsShapeSpec = {
    body: object,
    headers: object,
    url: string.isRequired
};

export default shape(uploaderRequestKeyParamsShapeSpec);
export {
    uploaderRequestKeyParamsShapeSpec
};
