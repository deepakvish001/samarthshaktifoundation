import LookupMasterContent from "./shared/LookupMasterContent";
export default function CasteCategoryMasterContent() {
  return (
    <LookupMasterContent
      tableName="caste_categories"
      title="Caste Categories / वर्ग"
      description="Options in the Category dropdown (e.g. General, OBC, SC, ST, EWS)."
    />
  );
}