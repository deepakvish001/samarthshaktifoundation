import LookupMasterContent from "./shared/LookupMasterContent";
export default function StudyCenterMasterContent() {
  return (
    <LookupMasterContent
      tableName="study_centers"
      title="Study Centers"
      description="Locations shown in the Examination Location dropdown on Student Registration."
      withCode
    />
  );
}