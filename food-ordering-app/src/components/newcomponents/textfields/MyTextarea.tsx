import { TextField } from "@mui/material";

type MyTextareaProps = {
  label?: string;
  placeholder?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
  error?: string;
  required?: boolean;
};

const MyTextarea: React.FC<MyTextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  rows = 3,
  className,
  error,
  required,
  ...rest
}) => {
  return (
    <TextField
      fullWidth
      multiline
      rows={rows}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      error={!!error}
      helperText={error}
      className={className}
      {...rest}
    />
  );
};

export default MyTextarea;
