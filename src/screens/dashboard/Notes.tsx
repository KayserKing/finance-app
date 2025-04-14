'use client'
import { Button, PopUp, Topic } from "@/components"
import { useUnsavedChanges } from "@/context";
import { useDashboardService } from "@/services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Notes = () => {
    const router = useRouter();
    const [notes, setNotes] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const { setHasUnsavedChanges, popupVisible, setPopupVisible, proceedCallback } = useUnsavedChanges();

    const { useNotes, useGetNotes } = useDashboardService();
    const { mutate: notesMutate } = useNotes({
        onSuccess: () => toast.success('Notes updated successfully!'),
        onError: () => toast.error('Something went wrong. Try again.')
    });
    const { data } = useGetNotes();

    const originalNotes = data?.data?.notes[0]?.content || '';

    useEffect(() => {
        setNotes(originalNotes);
    }, [originalNotes]);

    useEffect(() => {
        const original = data?.data?.notes[0]?.content || '';
        setHasUnsavedChanges(notes !== original);
    }, [notes, data?.data?.notes[0]?.content]);


    const handleSave = () => {
        notesMutate({ content: notes, noteId: process.env.NEXT_PUBLIC_NOTES_ID! });
        setHasUnsavedChanges(false);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
        setHasUnsavedChanges(true);
    };

    const handleCancel = () => {
        if (notes !== originalNotes) {
            setShowPopup(true);
        } else {
            router.push('/');
        }
    };

    const handleProceed = () => {
        setShowPopup(false);
        router.push('/');
    };

    const handlePopupCancel = () => {
        setShowPopup(false);

    };

    return (
        <div>
            {(showPopup) && (
                <PopUp
                    description="You have unsaved changes. Are you sure you want to leave?"
                    handleCancel={handlePopupCancel}
                    handleProceed={handleProceed}
                />
            )}

            {popupVisible && (
                <PopUp
                    description="You have unsaved changes. Are you sure you want to leave?"
                    handleCancel={() => setPopupVisible(false)}
                    handleProceed={() => {
                        setPopupVisible(false);
                        proceedCallback();
                    }}
                />
            )}

            <Topic title="NOTES" />

            <textarea
                value={notes}
                onChange={handleTextChange}
                className="bg-white border-[#004aad] rounded w-full px-2 h-[calc(100vh-300px)] focus:outline-none pr-10"
            />

            <div className="flex flex-row gap-4 mt-2 sm:justify-end">
                <Button
                    name="Cancel"
                    type="button"
                    handleClick={handleCancel}
                    className="p-2 w-full sm:w-24 bg-white !text-[#004aad] border-[0.5px] border-[#004aad]"
                />
                <Button
                    name="Save"
                    type="button"
                    handleClick={handleSave}
                    className="px-2 w-full sm:w-24"
                />
            </div>
        </div>
    );
};

export default Notes;
