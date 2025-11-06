import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { IoSave } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { RxLinkNone2 } from "react-icons/rx";
import { PiLinkSimple } from "react-icons/pi";
import { RiContactsLine } from "react-icons/ri";
import {
    useGetContactDetailsQuery,
    useUpdateContactDetailsMutation,
    useUpdateSocialHandlesMutation
} from "../../../store/api/contactDetailsApiSlice";
import InputSelector from "../components/InputSelector";
import FormInputError from "../../components/FormInputError";
import LoadingSpinner from "../../components/LoadingSpinner";
import socialPlatforms from "../../constants/socialPlatforms";
import styles from "./styles/ContactInfo.module.css";

const ContactInfo = () => {
    const {
        data: fetchContactDetails,
        isLoading: isContactLoading,
        isError
    } = useGetContactDetailsQuery();

    const [updateContact, { isLoading: isContactUpdating }] = useUpdateContactDetailsMutation();
    const [updateSocialHandles, { isLoading: isSocialUpdating }] = useUpdateSocialHandlesMutation();

    const {
        reset: resetContact,
        register: registerContact,
        handleSubmit: contactSubmit,
        formState: { errors: contactErrors },
    } = useForm();

    const {
        control,
        reset: resetSocial,
        register: socialRegister,
        handleSubmit: socialSubmit,
        formState: { errors: socialErrors },
    } = useForm();

    const { fields, append, remove } = useFieldArray({ control, name: "socialLinks" });

    const handleAddSocialLink = (selectedOption) => {
        const exists = fields.some((field) => field.platform === selectedOption.label);
        if(exists) alert("This social media link is already added.");
        else append({ platform: selectedOption.label, url: "" });
    };

    const onSubmitContact = async (data) => {
        try {
            await updateContact(data).unwrap();
        } catch (error) {
            toast.error("Failed to update contact details. Please try again.");
        }
    };

    const onSubmitSocialLinks = async (data) => {
        try {
            await updateSocialHandles(data).unwrap();
        } catch (error) {
            toast.error("Failed to update social media links. Please try again.");
        }
    };

    // Fetch contact info on mount
    useEffect(() => {
        resetContact(fetchContactDetails?.data.contactDetails);
        resetSocial(
            { socialLinks: fetchContactDetails?.data.socialMediaLinks },
            // { keepDefaultValues: true }
        )
    }, [fetchContactDetails, resetContact, resetSocial]);

    if(isError) {
        return <p>Failed to load contact details. Please try again later.</p>;
    }

    return (
        <>
            <section className="pageHeader">
                <h1>Contact Information</h1>
                <p>Update your contact details and social media links</p>
            </section>

            <section className="cardContainer">
                <div className="sectionHeader">
                    <div className="sectionHeading">
                        <RiContactsLine className="sectionIcon" />
                        <h2>Basic Contact</h2>
                    </div>
                </div>
                {isContactLoading ? (
                    <LoadingSpinner text="Contact Loading..." />
                ) : (
                    <form className="p-4 p-sm-6" onSubmit={contactSubmit(onSubmitContact)}>
                        <div className={styles.contactContainer}>
                            <div className={styles.digitalContact}>
                                <div>
                                    <label htmlFor="email">
                                        Email Address<span className="fromRequiredStar">*</span>
                                    </label>
                                    <div className={styles.inputWithIcon}>
                                        <input type="email" id="email" placeholder="contact@example.com"
                                            {...registerContact("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address"
                                                }
                                            })}
                                        />
                                    </div>
                                    <FormInputError message={contactErrors.email?.message} />
                                </div>

                                <div>
                                    <label htmlFor="phone">
                                        Phone Number<span className="fromRequiredStar">*</span>
                                    </label>
                                    <div className={styles.inputWithIcon}>
                                        <input type="text" id="phone" placeholder="+1 (123) 456-7890"
                                            {...registerContact("phone", {
                                                required: "Phone number is required"
                                            })}
                                        />
                                    </div>
                                    <FormInputError message={contactErrors.phone?.message} />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address">
                                    Address<span className="fromRequiredStar">*</span>
                                </label>
                                <textarea id="address" placeholder="Enter your address"
                                    {...registerContact("address", {
                                        required: "Address is required"
                                    })}
                                />
                                <FormInputError message={contactErrors.address?.message} />
                            </div>
                        </div>
                        <div className={styles.formButtons}>
                            <button type="button" className={styles.resetButton}
                                onClick={() => resetContact()}>
                                Reset
                            </button>
                            <button type="submit" className={styles.saveButton}
                                disabled={isContactUpdating}
                            >
                                <IoSave />
                                {isContactUpdating ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                )}
            </section>

            <section className="cardContainer">
                <div className="sectionHeader">
                    <div className="sectionHeading">
                        <PiLinkSimple className="sectionIcon" />
                        <h2>Social Media Links</h2>
                    </div>
                    <InputSelector handleAddSocialLink={handleAddSocialLink} />
                </div>
                <div className="p-4 p-sm-6">
                    <form onSubmit={socialSubmit(onSubmitSocialLinks)}>
                        {isContactLoading ? (
                            <LoadingSpinner text="Contact Loading..." />
                        ) : fields.length === 0 ? (
                            <div className={styles.emptyState}>
                                <RxLinkNone2 />
                                <h4>No social media links</h4>
                                <p>Add your social media links to display on your website.</p>
                            </div>
                        ) : (
                            <div className={styles.socialLinksList}>
                                {fields.map((field, index) => (
                                    <div key={field.id} className={styles.socialLinkItem}>
                                        <div className={styles.socialLinkHeader}>
                                            <span className={styles.socialLinkTitle}>
                                                {
                                                    socialPlatforms.find(platform =>
                                                        platform.name === field.platform)?.icon
                                                }
                                                {field.platform}
                                            </span>
                                            <button type="button" className={styles.deleteBtn}
                                                onClick={() => remove(index)}>
                                                <MdDelete />
                                            </button>
                                        </div>
                                        <div>
                                            <input type="hidden"
                                                {...socialRegister(`socialLinks.${index}.platform`)}
                                            />
                                            <div>
                                                <label htmlFor={`url-${index}`}>URL</label>
                                                <input type="text" id={`url-${index}`}
                                                    placeholder="https://example.com/profile"
                                                    {...socialRegister(`socialLinks.${index}.url`, {
                                                        required: "URL is required",
                                                        pattern: {
                                                            value: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i,
                                                            message: "Invalid URL format! Must start with https://"
                                                        }
                                                    })}
                                                />
                                                <FormInputError message={
                                                    socialErrors.socialLinks?.[index]?.url.message
                                                } />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {(fields.length > 0 || fetchContactDetails?.data.socialMediaLinks.length > 0) && (
                            <div className={styles.formButtons}>
                                <button type="button" className={styles.resetButton}
                                    onClick={() => resetSocial()}>
                                    Reset
                                </button>
                                <button type="submit" className={styles.saveButton}
                                    disabled={isSocialUpdating}
                                >
                                    <IoSave />
                                    {isSocialUpdating ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </section >
        </>
    );
};

export default ContactInfo;