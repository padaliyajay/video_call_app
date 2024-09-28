import { Input, Button } from "@material-tailwind/react";
import { PhoneIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useNavigate } from "react-router-dom";

export function DialForm() {
  const navigate = useNavigate();
  const [dialCode, setDialCode] = React.useState("");

  const onSubmit = () => {
    dialCode && navigate(`/call/${dialCode}`);
  };

  return (
    <div className="w-72">
      <Input
        value={dialCode}
        onChange={(e) => setDialCode(e.target.value.toUpperCase())}
        label="Enter Dial Code"
        size="lg"
        icon={<PhoneIcon className="w-4 h-4" />}
      />
      <Button
        className="mt-4"
        disabled={!dialCode || dialCode.length < 5}
        fullWidth
        onClick={onSubmit}
      >
        Join Call
      </Button>
    </div>
  );
}
