import {
    Button,
    Divider,
    ExpansionPanel, ExpansionPanelActions, ExpansionPanelDetails
} from "@material-ui/core";
import styles from "./panel.module.css";
/*
    Input: children: pages component
           expand:bool - collapse default open or close
           setOpen:function setState - function set varible expand
           setExecute:function - function call onClick button submit
*/
const PanelCollapse = ({
                children,
                expand,
                setOpen,
                setExecute
    }) => {
    // TODO

    function fnExecute(formData) {
        setExecute(formData)
    }

    return (
        <div>
            <form>
                <ExpansionPanel defaultExpanded={expand} style={{marginBottom:'1%'}}>
                    {/* <ExpansionPanelSummary>
                        <p>Tìm kiếm với: </p>
                    </ExpansionPanelSummary> */}
                    <ExpansionPanelDetails className={styles.details}>
                        {children}
                    </ExpansionPanelDetails>
                    <Divider />
                    <ExpansionPanelActions>
                        <Button size="small" onClick={() => {setOpen(!expand)}}>Đóng</Button>
                        <Button size="small" color="primary" onClick={fnExecute}>
                            Tìm kiếm
                        </Button>
                    </ExpansionPanelActions>
                </ExpansionPanel>
            </form>
        </div>
    )
}

export default PanelCollapse;