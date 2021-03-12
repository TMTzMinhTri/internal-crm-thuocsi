import { makeStyles } from "@material-ui/core";

export const useFormStyles = makeStyles({
    fieldLabel: {
        fontWeight: "bold",
    },
    required: {
        "&:after": {
            content: ` "*"`,
            color: "red",
        }
    }
})