import { CheckIcon } from "lucide-react";

export default function FormSave() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-md max-w-md w-full p-8">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="bg-purple-100 p-4 rounded-full">
            <CheckIcon className="h-8 w-8 text-purple-600" />
          </div>

          <h1 className="text-2xl font-semibold text-center">
            Form saved successfully!
          </h1>

          <p className="text-center text-gray-600">
            Form saved successfully. You can use this link to return and
            complete it later.
          </p>
        </div>
      </div>
    </div>
  );
}
