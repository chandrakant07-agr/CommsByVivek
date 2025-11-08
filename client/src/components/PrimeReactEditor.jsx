import { Editor } from 'primereact/editor';
import PropTypes from 'prop-types'

/**
 * PrimeReact Editor component wrapper for seamless integration with react-hook-form
 *
 * @param {Object} props - Component props
 * @param {string} [props.id=""] - Editor unique ID
 * @param {number} [props.height=400] - Editor height in pixels
 * @param {string} [props.value=""] - Current content value (HTML string)
 * @param {function} props.onChange - Function called when content changes
 * @returns {React.ReactElement} PrimeReact Editor component
 */

const modules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        ['blockquote', 'code-block'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ]
};

const PrimeReactEditor = ({ id, height, value, onChange, placeholder }) => {
    return (
        <Editor
            id={id}
            className="primeReaceEditorClass"
            value={value}
            style={{ height: height }}
            onTextChange={(e) => onChange(e.htmlValue)}
            placeholder={placeholder}
            modules={modules}
        />
    );
};

PrimeReactEditor.propTypes = {
    id: PropTypes.string,
    value: PropTypes.string,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired
};

export default PrimeReactEditor;