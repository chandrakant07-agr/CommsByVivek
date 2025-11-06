import { useMemo } from 'react';
import Select from 'react-select';
import socialPlatforms from '../../constants/socialPlatforms';

const customStyle = {
    input: (provided) => ({
        ...provided,
        width: "12.5rem",
        padding: "0",
        fontSize: "0.9rem",
    }),
    menu: (provided) => ({
        ...provided,
        color: "var(--text-color)",
        backgroundColor: "var(--input-bg-color)",
        border: "1px solid var(--input-border-color)",
        borderRadius: "0.5rem",
        boxShadow: "var(--box-shadow)",
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused
            ? "var(--cornflower-blue)"
            : "var(--input-bg-color)",
        color: state.isFocused ? "var(--white)" : "var(--text-color)",
        cursor: "pointer",
        "&:active": {
            backgroundColor: "var(--indigo)",
        },
        transition: "all 0.3s ease"
    }),
    control: (provided, state) => ({
        ...provided,
        backgroundColor: "var(--input-bg-color)",
        fontSize: "0.875rem",
        color: "var(--text-color)",
        border: state.isFocused ? "2px solid var(--indigo)"
            : "1px solid var(--input-border-color)",
        borderRadius: "0.5rem",
        boxShadow: "var(--box-shadow)",
        transition: "all 0.3s ease",
        "&:focus": {
            borderColor: "var(--indigo)",
        }
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "var(--text-color)",
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: "var(--text-color)",
        "&:hover": {
            color: "var(--indigo)",
        }
    }),
    placeholder: (provided) => ({
        ...provided,
        color: "var(--placeholder-color)",
    }),
}

const InputSelector = ({ handleAddSocialLink }) => {
    const options = useMemo(() => {
        return socialPlatforms.map((platform) => ({
            label: platform.name,
            icon: platform.icon
        }));
    }, []);

    return (
        <Select
            options={options}
            // className={styles.selectButton}
            formatOptionLabel={({ label, icon }) => (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ display: "inherit", fontSize: "1rem" }}>{icon}</span>
                    <p>{label}</p>
                </div>
            )}
            onChange={handleAddSocialLink}
            styles={customStyle}
            placeholder="Choose a social platform..."
        />
    );
};

export default InputSelector;