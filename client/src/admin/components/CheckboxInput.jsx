import styles from "./styles/CheckboxInput.module.css";

const CheckboxInput = ({
    id,
    name,
    size,
    register,
    onChange,
    label = "",
    value = "",
    disabled = false,
    defaultChecked = false,
    ...attribute
}) => {
    const sizeClass = {
        "sm": styles.small,
        "lg": styles.large
    }[size] || "";

    return (
        <div className={`${styles.checkboxWrapper} ${sizeClass}`}>
            {label && <span className={styles.labelText}>{label}</span>}
            <input
                type="checkbox"
                id={id}
                name={name}
                value={value}
                disabled={disabled}
                defaultChecked={defaultChecked}
                className={styles.customCheckboxInput}
                {...(register ? register(name) : {})}
                {...(onChange ? { onChange } : {})}
            />
            <label
                htmlFor={id || name}
                className={`${styles.customCheckboxLabel} ${disabled ? styles.disabled : ''}`}
                {...attribute}
            >
                <span className={styles.checkboxBox}>
                    <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
            </label>
        </div>
    );
};

export default CheckboxInput;