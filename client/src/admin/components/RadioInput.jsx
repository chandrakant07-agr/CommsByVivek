import styles from "./styles/RadioInput.module.css";

const RadioInput = ({
    name,
    label,
    labelClass,
    required = false,
    register,
}) => {
    return (
        <>
            <div className={labelClass}>
                {label}{
                    required
                        ? <span className="formRequiredStar">*</span>
                        : <sup className="formOptional">(optional)</sup>
                }
            </div>

            <div className="ml-1">
                <div>
                    <input type="radio" id="locPortfolio" value="portfolio"
                        className={styles.customRadioInput}
                        {...register(name, {
                            required: required ? "Display location is required" : false,
                        })}
                    />
                    <label htmlFor="locPortfolio" className={styles.customRadioLabel}>
                        Portfolio Page
                    </label>
                </div>

                <div>
                    <input type="radio" id="locFilmedByVivek" value="filmedByVivek"
                        className={styles.customRadioInput}
                        {...register(name, {
                            required: required ? "Display location is required" : false,
                        })}
                    />
                    <label htmlFor="locFilmedByVivek" className={styles.customRadioLabel}>
                        FilmedByVivek Page
                    </label>
                </div>
            </div>
        </>
    )
}

export default RadioInput;