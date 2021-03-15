import { makeStyles } from "@material-ui/core";

export const useFormStyles = makeStyles(theme => ({
    fieldLabel: {
        fontWeight: "bold",
    },
    required: {
        "&:after": {
            content: ` "*"`,
            color: "red",
        }
    },
    readOnlyInfoCard: {
        borderRadius: 16,
        border: "none",
        backgroundColor: theme.palette.grey[100]
    }
}));