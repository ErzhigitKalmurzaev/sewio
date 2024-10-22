export const validationInputs = ({ validation, setValidation, newForm }) => {
    const keys = Object.keys(validation);
    let check = true;

    keys.forEach(item => {
        if(!newForm[item]) {
            setValidation(prev => ({ ...prev, [item]: true }));
            check = false;
        } else {
            setValidation(prev => ({ ...prev, [item]: false }));
        }
    })

    return check
}