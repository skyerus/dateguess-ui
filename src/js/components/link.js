import React from 'react'
import {Link as ReactLink} from 'react-router-dom'

import { makeStyles, useTheme } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
	link: {
		color: theme.palette.type === 'light' ? '#000' : '#fff',
		textDecoration: 'none',
	}
}))

function Link(props) {
	const theme = useTheme()
	const classes = useStyles(theme)
	return <ReactLink {...props} className={classes.link}>
		{props.children}
	</ReactLink>
}

export default Link
