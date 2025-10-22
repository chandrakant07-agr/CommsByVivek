const FormInputError = ({ message }) => 
    message && <div className="formErrorMessage"><span>{message}</span></div>;

export default FormInputError;