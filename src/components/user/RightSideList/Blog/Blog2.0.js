import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "next/router";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

//components
import PhotoUpload from "./PhotoUpload";
import CategoryCheckBox from "./CategoryCheckBox";
import TagCheckBox from "./TagCheckBox";
import CustomizedSnackbars from "../../../../utils/components/SnackBar";

//actions
import { startCreateBlog } from "../../../../redux/actions/blogActions";
import { startGetCategories } from "../../../../redux/actions/categoryActions";
import { startGetTags } from "../../../../redux/actions/tagActions";

//helpers
import useStyles from "./useStyles";
import { quillModules, quillFormats } from "./quillHelper";
import LocalStoragePullData from "./LocalStoragePullData";
import { isServer } from "../../../../utils/functions/isServer";
import { blogSchema } from "../../../admin/rightSideList/Blog/blogSchema";

function Blog2point0({
  router,
  categories,
  tags,
  startCreateBlog,
  startGetCategories,
  startGetTags,
}) {
  const initialState = {
    title: LocalStoragePullData("title"),
    photo: undefined,
    categoriesChecked: [],
    tagsChecked: [],
    message: "",
    error: "",
    loading: false,
  };
  const classes = useStyles();
  const [state, setState] = useState(initialState);
  const [body, setBody] = useState(LocalStoragePullData("body"));

  const {
    title,
    photo,
    categoriesChecked,
    tagsChecked,
    message,
    error,
    loading,
  } = state;

  useEffect(() => {
    startGetCategories();
    startGetTags();
  }, [router]);

  useEffect(() => {
    if (message) {
      reset();
    }
  }, [message]);

  const changeState = (message, error) => {
    setState({ ...state, message, error });
  };

  const reset = () => {
    setState({
      title: "",
      photo: undefined,
      categoriesChecked: [],
      tagsChecked: [],
      message: message,
      error: error,
      loading: false,
    });
    setBody("");
    localStorage.removeItem("title");
    localStorage.removeItem("body");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("body", body);
    formData.append("photo", photo);
    formData.append("categories", categoriesChecked);
    formData.append("tags", tagsChecked);
    //validate the form
    if (photo) {
      const validateForm = {
        title,
        body,
        photo,
        categories: categoriesChecked,
        tags: tagsChecked,
      };

      blogSchema
        .validate(validateForm)
        .then((val) => {
          startCreateBlog(formData, changeState);
        })
        .catch((err) => {
          console.log(err.message);
          changeState("", err.message);
        });
    } else {
      changeState("", "Feature photo is required");
    }
  };

  const handleChange = (e) => {
    const data = e.target.name === "photo" ? e.target.files[0] : e.target.value;
    setState({ ...state, [e.target.name]: data });
    if (!isServer() && e.target.name !== "photo") {
      localStorage.setItem([e.target.name], JSON.stringify(data));
    }
  };

  const handleBodyChange = (e) => {
    setBody(e);
    if (!isServer()) {
      localStorage.setItem("body", JSON.stringify(e));
    }
  };

  return (
    <>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={10}>
            <Grid
              container
              spacing={3}
              direction="column"
              justify="center"
              alignItems="center"
              alignContent="center"
              wrap="nowrap"
            >
              <Grid item style={{ width: "100%" }}>
                <form onSubmit={handleSubmit}>
                  <Grid
                    container
                    spacing={3}
                    direction="column"
                    justify="center"
                    alignItems="center"
                    alignContent="center"
                    wrap="nowrap"
                  >
                    <Grid item style={{ width: "100%" }}>
                      <TextField
                        id="title"
                        name="title"
                        label="Title of Blog"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={handleChange}
                        required
                      />
                    </Grid>
                    <Grid style={{ width: "100%" }} item>
                      <ReactQuill
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Pen your thougts"
                        value={body}
                        onChange={handleBodyChange}
                      />
                    </Grid>

                    <Grid style={{ width: "100%" }} item>
                      <Grid container spacing={2}>
                        <Grid item xs={10}>
                          <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                          >
                            PUBLISH BLOG
                          </Button>
                        </Grid>
                        <Grid item xs={2}>
                          <Button
                            style={{ width: "100%" }}
                            variant="contained"
                            color="secondary"
                            onClick={reset}
                          >
                            CLEAR ALL
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <PhotoUpload handleChange={handleChange} />
              </Grid>
              <Grid item style={{ width: "100%" }}>
                <CategoryCheckBox
                  categories={categories}
                  state={state}
                  setState={setState}
                  categoriesChecked={categoriesChecked}
                />
              </Grid>

              <Grid item style={{ width: "100%" }}>
                <TagCheckBox
                  tags={tags}
                  state={state}
                  setState={setState}
                  tagsChecked={tagsChecked}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <CustomizedSnackbars
        changeState={changeState}
        message={message}
        error={error}
        reset={reset}
      />
    </>
  );
}

const mapStateToProps = (state) => ({
  categories: state.categories,
  tags: state.tags,
});

const mapDispatchToProps = {
  startCreateBlog,
  startGetCategories,
  startGetTags,
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Blog2point0);
