import React, { Component } from "react";
import { connect } from "react-redux";
import Router from "next/router";
import LinkNext from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import useStyles from "./useStyles";
import { startRegisterUser } from "../../../redux/actions/userActions";
import CustomizedSnackbars from "../../../utils/components/SnackBar";
import schema from "./schema";

const initialValues = {
  name: "",
  email: "",
  password: "",
};

export class SignupComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      error: "",
      loading: false,
      message: "",
    };
  }

  handleClickShowPassword = () => {
    this.setState((prevState) => ({ showPassword: !prevState.showPassword }));
  };

  handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  changeState = (message, error) => {
    this.setState({
      loading: false,
      message,
      error,
    });
  };

  handleSubmit = (values) => {
    const formData = {
      name: values.name,
      email: values.email,
      password: values.password,
    };
    this.setState({ loading: true });
    this.props.dispatch(startRegisterUser(formData, this.changeState));
  };

  redirect = () => {
    return Router.push("/signin");
  };

  render() {
    const { classes } = this.props;
    return (
      <>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>

            <Formik
              initialValues={initialValues}
              onSubmit={(values) => this.handleSubmit(values)}
              validationSchema={schema}
            >
              {({
                setFieldValue,
                setFieldTouched,
                values,
                errors,
                touched,
              }) => (
                <Form className={classes.form}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        variant="outlined"
                        required
                        fullWidth
                        name="name"
                        label="Name"
                        type="name"
                        id="name"
                        helperText={<ErrorMessage name="name"></ErrorMessage>}
                        error={touched.name && Boolean(errors.name)}
                        as={TextField}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        variant="outlined"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        helperText={<ErrorMessage name="email"></ErrorMessage>}
                        error={touched.email && Boolean(errors.email)}
                        as={TextField}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        variant="outlined"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={this.state.showPassword ? "text" : "password"}
                        id="password"
                        InputProps={{
                          endAdornment: (
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={this.handleClickShowPassword}
                              onMouseDown={this.handleMouseDownPassword}
                            >
                              {this.state.showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          ),
                        }}
                        helperText={
                          <ErrorMessage name="password"></ErrorMessage>
                        }
                        error={touched.password && Boolean(errors.password)}
                        as={TextField}
                      />
                    </Grid>

                    {/*  <PasswordPopOver
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      helperText={<ErrorMessage name="password"></ErrorMessage>}
                      error={touched.password && Boolean(errors.password)}
                      as={TextField}
                    /> */}
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Sign Up
                    {/* {this.state.loading && <CircularProgress />} */}
                  </Button>
                  <Grid container justify="flex-end">
                    <Grid item>
                      <LinkNext href="/signin">
                        <Link variant="body2">
                          Already have an account? Sign in
                        </Link>
                      </LinkNext>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </div>
          <CustomizedSnackbars
            changeState={this.changeState}
            message={this.state.message}
            error={this.state.error}
            redirect={this.redirect}
          />
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(withStyles(useStyles)(SignupComponent));
