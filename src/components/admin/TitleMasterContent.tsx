import LookupMasterContent from "./shared/LookupMasterContent";
export default function TitleMasterContent() {
  return (
    <LookupMasterContent
      tableName="titles"
      title="Titles / उपाधि"
      description="Salutations used before Applicant / Father / Mother names (e.g. Mr., Mrs., Ms.)."
    />
  );
}