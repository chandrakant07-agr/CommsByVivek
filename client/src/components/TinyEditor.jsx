import { Editor } from '@tinymce/tinymce-react';
import PropTypes from 'prop-types';

/**
 * TinyMCE editor component that can be easily used with react-hook-form
 * 
 * @param {Object} props - Component props
 * @param {string} [props.id='tiny-editor'] - Editor unique ID
 * @param {number} [props.height=400] - Editor height
 *  @param {string} [props.value=''] - Initial content value
 * @param {function} props.onChange - Function called when content changes
 * @param {string} [props.placeholder=''] - Placeholder text when editor is empty
 * @param {Object} [props.customConfig={}] - Additional TinyMCE config options
 * @returns {React.ReactElement} TinyMCE editor component
 */

const TinyEditor = ({ id, height, value, onChange, placeholder, customConfig }) => {

    return (
        <Editor
            id={id}
            value={value}
            apiKey={import.meta.env.VITE_TINY_MCE_API_KEY || ''}
            init={{
                height,
                menubar: false,
                plugins: [
                    "advlist", "autolink", "lists", "link", "charmap", "preview",
                    "searchreplace", "fullscreen", "help", "wordcount"
                ],  
                toolbar: `undo redo bold italic underline backcolor | fontsize bullist numlist link 
                    preview | blocks fontfamily | alignleft aligncenter alignright alignjustify 
                    outdent indent | searchreplace removeformat charmap fullscreen help`,
                content_style: `body {
                    font-family:Inter,Arial,sans-serif; font-size:16px; line-height:1.5;
                }`,
                placeholder,
                branding: false,
                promotion: false,
                ...customConfig,
            }}
            onEditorChange={onChange}
        />
    );
};

TinyEditor.propTypes = {
    id: PropTypes.string,
    value: PropTypes.string,
    height: PropTypes.number,
    placeholder: PropTypes.string,
    customConfig: PropTypes.object,
    onChange: PropTypes.func.isRequired
};

export default TinyEditor;
