import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { TagsInput } from "react-tag-input-component";
import { IoSave } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi";
import {
    useGetProjectTypesQuery,
    useSyncProjectTypeMutation
} from "../../../store/api/projectTypeApiSlice";
import styles from './styles/ProjectType.module.css';

const ProjectType = () => {
    const { control, handleSubmit, setValue, watch } = useForm();
    const { data: fetchedTypes, isLoading, isError } = useGetProjectTypesQuery();
    const [syncProjectTypes, { isLoading: isSyncing }] = useSyncProjectTypeMutation();

    // Set project tags from API
    useEffect(() => {
        setValue("projectTypes", fetchedTypes?.data.map(type => type.name));
    }, [fetchedTypes]);

    if(isLoading) {
        return <p>Loading project types...</p>;
    }

    if(isError) {
        return <p>Error loading project types.</p>;
    }

    return (
        <>
            <section className={styles.pageHeader}>
                <div>
                    <h1>Manage Project Types</h1>
                    <p className={styles.formDescription}>
                        Sync project types that will be displayed in the contact form dropdown.
                    </p>
                </div>
            </section>

            <section className={styles.cardContainer}>
                {/* Project Types Management */}
                <div className={styles.formSection}>
                    <form onSubmit={handleSubmit(syncProjectTypes)}>
                        <div className={styles.tagsInputWrapper}>
                            <Controller
                                name="projectTypes"
                                control={control}
                                render={({ field }) => (
                                    <TagsInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeHolder="Type a project category and press Enter..."
                                    />
                                )}
                            />
                            <small className={styles.tagsHelperText}>
                                Press Enter to add a new project type
                            </small>
                        </div>

                        <button type="submit"
                            disabled={isSyncing}
                            className={`${styles.saveButton} ${(isSyncing) ? styles.saveButtonDisabled : ''}`}
                        >
                            <IoSave />
                            {isSyncing ? "Saving..." : "Save Project Types"}
                        </button>
                    </form>
                </div>

                {/* Empty State (shown when no project types exist) */}
                {isLoading ? (
                    <p>Loading project types...</p>
                ) : watch("projectTypes")?.length === 0 && (
                    <div className={styles.emptyState}>
                        <HiOutlineDocumentText />
                        <h4>No project types defined</h4>
                        <p>Add your first project type above to get started.</p>
                    </div>
                )}
            </section>
        </>
    );
};

export default ProjectType;