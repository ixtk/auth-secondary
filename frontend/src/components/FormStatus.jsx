export const FormStatus = ({ message, errors }) => {
  return (
    <div className="mb-4 p-2 border border-red-500 rounded-sm text-sm bg-red-100 text-red-600">
      <p>{message}</p>
      {errors && (
        <ul className="mt-2 list-disc list-inside">
          {errors.map((error, index) => {
            return <li key={index}>{error}</li>
          })}
        </ul>
      )}
    </div>
  )
}
