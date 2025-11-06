import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { TagsInput } from "react-tag-input-component";
import { toast } from "react-toastify";
import { IoSave } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi";
import {
    useGetProjectTypesQuery,
    useSyncProjectTypeMutation
} from "../../../store/api/projectTypeApiSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import styles from './styles/ProjectType.module.css';

const ProjectType = () => {
    const { control, handleSubmit, reset, watch } = useForm();
    const { data: fetchedTypes, isLoading, isError } = useGetProjectTypesQuery();
    const [syncProjectTypes, { isLoading: isSyncing }] = useSyncProjectTypeMutation();

    const onSubmitProjectTypes = async (data) => {
        try {
            await syncProjectTypes({ projectTypes: data.projectTypes }).unwrap();
        } catch (error) {
            toast.error("Failed to update project types. Please try again.");
        }
    };

    // Set project tags from API
    useEffect(() => {
        reset({ projectTypes: fetchedTypes?.data.map(type => type.name) || [] });
    }, [fetchedTypes, reset]);

    if(isError) {
        return <p>Error loading project types.</p>;
    }

    return (
        <>
            <section className="pageHeader">
                <h1>Manage Project Types</h1>
                <p className={styles.formDescription}>
                    Sync project types that will be displayed in the contact form dropdown.
                </p>
            </section>

            <section className="cardContainer p-4 p-sm-6">
                {/* Project Types Management */}
                {isLoading ? (
                    <LoadingSpinner text="Loading project types..." />
                ) : (
                    <>
                        <div className={styles.formSection}>

                            <form onSubmit={handleSubmit(onSubmitProjectTypes)}>
                                <div className={styles.tagsInputWrapper}>
                                    <Controller
                                        name="projectTypes"
                                        control={control}
                                        render={({ field }) => (
                                            <TagsInput
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                placeHolder="Type a project category and press Enter..."
                                            />
                                        )}
                                    />
                                    <small className={styles.tagsHelperText}>
                                        Press Enter to add a new project type
                                    </small>
                                </div>

                                <div className={styles.formButtons}>
                                    <button type="button" className={styles.resetButton}
                                        onClick={() => reset()}>
                                        Reset
                                    </button>
                                    <button type="submit"
                                        disabled={isSyncing}
                                        className={`${styles.saveButton} ${(isSyncing) ? styles.saveButtonDisabled : ''}`}
                                    >
                                        <IoSave />
                                        {isSyncing ? "Saving..." : "Save Project Types"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Empty State (shown when no project types exist) */}
                        {watch("projectTypes")?.length === 0 && (
                        <div className={styles.projectTypeEmptyState}>
                            <HiOutlineDocumentText />
                            <h4>No project types defined</h4>
                            <p>Add your first project type above to get started.</p>
                        </div>
                        )}
                    </>
                )}
            </section>
        </>
    );
};

export default ProjectType;