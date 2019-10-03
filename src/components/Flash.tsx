import * as React from "react";

const Flash = props => (
    <div className='Flash'>
        <div className={ props.error ? 'FlashMessageWrapperError' : 'FlashMessageWrapper'}>
          {props.error ? null : <div className="loader" /> }
       
          <p className='FlashMessage'>
            {props.message}
          </p>
        </div>
    </div>
);

export default Flash;