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
                        ? <span className="fromRequiredStar">*</span>
                        : <sup className="fromOptional">(optional)</sup>
                }
            </div>

            <div className="ml-1">
                <div>
                    <input type="radio" id="locPortfolio" value="portfolio"
                        className={styles.customRadioInput}
                        {...register(name, {
                            required: "Display location is required",
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
                            required: "Display location is required"
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