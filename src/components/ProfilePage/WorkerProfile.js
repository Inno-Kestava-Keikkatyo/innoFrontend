import React, { useState } from 'react'
import { Formik, Form, FieldArray } from 'formik'
import PropTypes from 'prop-types'
import * as Yup from 'yup'

import { FormikTextField } from '../FormField'

import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  FormControlLabel,
  Switch,
  IconButton,
} from '@material-ui/core'
import { Delete as DeleteIcon, Add as AddIcon } from '@material-ui/icons'

/**
 * Component for displaying and updating worker profile information.
 * @exports components/ProfilePage/WorkerProfile
 * @param {Object} props
 * @param {Object} props.profile - Worker profile data that is used for initialization
 * @param {function} props.handleSubmit - Function for updating worker's profile information
 */
const WorkerProfile = ({ profile, handleSubmit }) => {
  const [edit, setEdit] = useState(true)

  return (
    <Card variant="outlined">
      <CardContent>
        <Box
          paddingBottom={2}
          display="flex"
          flexDirection="row"
          justifyContent="space-between">
          <Typography align="center" variant="h4">
            Profile
          </Typography>
          <FormControlLabel
            control={<Switch
              size="small"
              checked={!edit}
              onChange={() => setEdit(prevEdit => !prevEdit)}
            />}
            label="edit"
          />
        </Box>
        <Formik
          initialValues={{
            name: profile.name,
            phonenumber: profile.phonenumber || '',
            licenses: profile.licenses || []
          }}
          validationSchema={
            Yup.object().shape({
              name: Yup.string().min(3).required('required'),
              phonenumber: Yup.string()
                .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g, 'Not a valid phonenumber'),
              licenses: Yup.array().of(
                Yup.string().min(4).required('required')
              )
            })
          }
          onSubmit={(values) => {
            setEdit(prevEdit => !prevEdit)
            handleSubmit(values)
          }}>
          {({ isValid, dirty, values, errors }) => (
            <Form>
              <Box
                display="flex"
                flexDirection="column">
                <FormikTextField
                  label="Name"
                  name="name"
                  type="text"
                  placeholder="jarmo"
                  disabled={edit}
                />
                <FormikTextField
                  label="Phone number"
                  name="phonenumber"
                  type="text"
                  placeholder="12342"
                  disabled={edit}
                />
                <FieldArray name="licenses">
                  {arrayHelpers => (
                    <Box
                      display="flex"
                      flexDirection="column"
                      paddingBottom={2}>
                      <Box display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center">
                        <Typography variant="h5">
                          Licenses
                        </Typography>
                        <IconButton
                          disabled={edit || !!errors.licenses}
                          color="secondary"
                          onClick={() => arrayHelpers.push('')}>
                          <AddIcon />
                        </IconButton>
                      </Box>
                      {values.licenses.map((license, index) => (
                        <Box key={index}
                          display="flex"
                          flexDirection="row"
                          alignItems="center">
                          <FormikTextField
                            label="Name"
                            name={`licenses.${index}`}
                            type="text"
                            disabled={edit}
                            fullWidth
                          />
                          <IconButton
                            disabled={edit}
                            onClick={() => arrayHelpers.remove(index)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </FieldArray>
                <Button
                  type="submit"
                  disabled={!dirty || !isValid || edit}
                  variant="contained"
                  color="primary">
                  submit
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  )
}

WorkerProfile.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    phonenumber: PropTypes.string
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default WorkerProfile