import Link from "@material-ui/core/Link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight} from "@fortawesome/free-solid-svg-icons";
import {Container, Grid} from "@material-ui/core";
import React from "react";
import styles from "../../../pages/crm/promotion/promotion.module.css";

export default function  TitleLink(props) {
    const {urls} = props
    return (
        <Grid direction={"row"}  className={styles.hoverSpan}>
            {urls.map(({url,title},index) => (
                index < urls.length - 1 ? (
                    <Link href={url}>
                        <span>{title}</span>
                        <FontAwesomeIcon icon={faAngleRight} style={{margin: "0 0.5rem"}}/>
                    </Link>
                ): (
                    <Link href={url}>
                        <span style={{fontWeight: "bold"}}>{title}</span>
                    </Link>
                )
            ))}
        </Grid>
    )
}
