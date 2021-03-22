/* eslint-disable no-unused-vars */
import React from "react";
import {
    Card,
    Drawer,
    makeStyles,
    ModalProps,
    DrawerProps,
    CardProps,
    CardHeaderProps,
} from "@material-ui/core";
import { MyCardHeader } from "@thuocsi/nextjs-components/my-card/my-card";

const useStyles = makeStyles((theme) => ({
    drawerContainer: {
        boxSizing: "border-box",
        maxWidth: "90vw",
        [theme.breakpoints.up("xs")]: {
            minWidth: "90vw",
        },
        [theme.breakpoints.up("sm")]: {
            minWidth: "580px",
        },
        [theme.breakpoints.up("md")]: {
            minWidth: "880px",
        },
    },
    card: {
        minHeight: "100vh",
    },
}));

/**
 * 
 * @param {object} props
 * @param {boolean} props.open
 * @param {ModalProps['onClose']} props.onClose
 * @param {string} props.title
 * @param {DrawerProps} props.DrawerProps Override for drawer container
 * @param {CardProps} props.CardProps Override for card container
 * @param {CardHeaderProps} props.CardHeaderProps Override for header
 */
export const MyDrawer = ({
    open,
    onClose,
    title,
    children,
    DrawerProps,
    CardProps,
    CardHeaderProps
}) => {
    const classes = useStyles();
    return (
        <Drawer
            PaperProps={{
                className: classes.drawerContainer
            }}
            anchor="right"
            open={open}
            onClose={onClose}
            {...DrawerProps}
        >
            <Card
                className={classes.card}
                {...CardProps}
            >
                <MyCardHeader
                    title={title}
                    {...CardHeaderProps}
                />
                {children}
            </Card>
        </Drawer>
    );
};
