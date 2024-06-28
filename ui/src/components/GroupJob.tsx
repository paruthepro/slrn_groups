import React, { useState, useEffect } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { fetchReactNui } from "../utils/fetchReactNui";
import { GroupJobStep } from "../types/GroupJobStep";
import { useGroupJobStepStore } from "../storage/GroupJobStepStore";
import { useGroupStore } from "../storage/GroupStore";
import { usePlayerDataStore } from "../storage/PlayerDataStore";

interface GroupJobProps {
  initialSteps: GroupJobStep[];
}

const {
  fetchNui,
} = window as any;

const GroupJob: React.FC<GroupJobProps> = ({ setCurrentPage }) => {
  const { currentGroups, currentGroup, inGroup } = useGroupStore();
  const { playerData } = usePlayerDataStore();
  const { groupJobSteps, setGroupJobSteps } = useGroupJobStepStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmation, setConfirmation] = useState({ message: null, type: null });

  useEffect(() => {
    fetchReactNui("getGroupJobSteps").then((data) => setGroupJobSteps(data));
  }, []);

  const handleConfirm = () => {
    fetchNui(confirmation.type);
    setIsDialogOpen(false);
  };

  const leaveGroup = () => {
    setConfirmation({message: "Leave the group?", type: "leaveGroup"})
    setIsDialogOpen(true);
  };

  return (
    <div className="flex items-center">
      <div className="w-full p-2">
        <div className="mb-4 flex gap-x-2 text-xl">
          <button
            onClick={() => setCurrentPage("GroupDashboard")}
            className={`p-2 w-1/2 bg-primary rounded
              ${!inGroup ? "cursor-not-allowed" : "hover:bg-secondary"}`}
          >
            Show Groups
          </button>
          <button
            onClick={() => leaveGroup()}
            className={`px-4 py-2 w-1/2 bg-primary rounded
              ${!inGroup ? "cursor-not-allowed" : "hover:bg-danger"}`}
          >
            Leave Group
          </button>
        </div>
          <span className="mb-4 text-2xl">{groupJobSteps.length > 0 ? ( 'Here are the current group tasks') : ( 'No tasks available' )}</span>
        <div className="w-full p-2">
          <div className="relative border-l border-accent ml-4 pl-4">
            {groupJobSteps.map((step) => (
              <div key={step.id} className="mb-6 flex items-center">
                <span className="absolute left-0 transform -translate-x-1/2 bg-background border border-accent w-6 h-6 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon
                    icon={faCircle}
                    className={step.isDone ? "text-success" : ""}
                  />
                </span>
                <div className="ml-8">
                  <div className="text-sm">
                    {step.isDone ? "1 / 1" : "0 / 1"}
                  </div>
                  <div>{step.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {isDialogOpen && (
          <ConfirmationDialog
            onClose={() => setIsDialogOpen(false)}
            onConfirm={handleConfirm}
            confirmation={confirmation}
          />
        )}
      </div>
    </div>
  );
};

export default GroupJob;
