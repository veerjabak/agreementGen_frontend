import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  form: {
    padding: theme.spacing(3),
  },
  formControl: {
    minWidth: 200,
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(2),
    backgroundColor: "#4CAF50",
  },
  appBar: {
    backgroundColor: "#4CAF50", // Custom color
  },
  logo: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  keywordContainer: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    backgroundColor: "#4CAF50",
  },
}));

const Agreement = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    uuid: "",
    ownerName: "",
    ownerAddress: "",
    ownerRelative: "",
    ownerMobile: "",
    renterName: "",
    renterAddress: "",
    renterRelative: "",
    renterMobile: "",
    squareFeet: "",
    apartmentAddress: "",
    rooms: "",
    bathrooms: "",
    leaseMonths: "",
    advanceAmount: "",
    rentPerMonth: "",
    reasons: {
      autoGenerate: false,
      setManually: false,
    },
    manualReasons: [""],
    level: "",
  });

  const generateUUID = () => {
    return uuidv4();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      reasons: {
        autoGenerate: name === "autoGenerate" ? checked : false,
        setManually: name === "setManually" ? checked : false,
      },
      manualReasons: name === "setManually" && checked ? [""] : [],
    });
  };

  const handleKeywordChange = (index, value) => {
    const updatedKeywords = [...formData.manualReasons];
    updatedKeywords[index] = value;
    setFormData({ ...formData, manualReasons: updatedKeywords });
  };

  const addKeywordField = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      manualReasons: [...prevFormData.manualReasons, ""],
    }));
  };

  const removeKeywordField = (index) => {
    const updatedKeywords = [...formData.manualReasons];
    updatedKeywords.splice(index, 1);
    setFormData({ ...formData, manualReasons: updatedKeywords });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      "ownerName",
      "ownerAddress",
      "ownerRelative",
      "ownerMobile",
      "renterName",
      "renterAddress",
      "renterRelative",
      "renterMobile",
      "squareFeet",
      "apartmentAddress",
      "rooms",
      "bathrooms",
      "leaseMonths",
      "advanceAmount",
      "rentPerMonth",
      "level",
    ];

    const missingFields = requiredFields.filter((field) => {
      if (field.startsWith("manualReason")) {
        return formData.manualReasons.some((reason) => !reason.trim());
      }
      return !formData[field];
    });

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    if (
      formData.reasons.setManually &&
      formData.manualReasons.some((reason) => !reason.trim())
    ) {
      toast.error("Please fill in all manual reasons.");
      return;
    }

    const uuid = generateUUID();
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, uuid: uuid };
      console.log(JSON.stringify(updatedFormData));
      fetch("http://127.0.0.1:8000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFormData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          console.log("Data sent successfully");
        })
        .catch((error) => {
          console.error(
            "There was a problem with your fetch operation:",
            error
          );
        });
      return updatedFormData;
    });

    toast.success("Form submitted successfully!");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Agreement Generator
          </Typography>
        </Toolbar>
      </AppBar>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6">Owner</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address"
              name="ownerAddress"
              value={formData.ownerAddress}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Son/Daughter/Husband/Wife of"
              name="ownerRelative"
              value={formData.ownerRelative}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mobile No"
              name="ownerMobile"
              value={formData.ownerMobile}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6">Renter</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="renterName"
              value={formData.renterName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address"
              name="renterAddress"
              value={formData.renterAddress}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Son/Daughter/Husband/Wife of"
              name="renterRelative"
              value={formData.renterRelative}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Mobile No"
              name="renterMobile"
              value={formData.renterMobile}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount of Square Feet"
              name="squareFeet"
              value={formData.squareFeet}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address of Apartment/House"
              name="apartmentAddress"
              value={formData.apartmentAddress}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="No of Rooms"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              select
              required
            >
              {[1, 1.5, 2, 3, 3.5, 4].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="No of Bathrooms"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              select
              required
            >
              {[1, 1.5, 2, 3, 3.5, 4].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Number of months of lease"
              name="leaseMonths"
              value={formData.leaseMonths}
              onChange={handleChange}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Advance Amount (INR)"
              name="advanceAmount"
              value={formData.advanceAmount}
              onChange={handleChange}
              type="number"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Per Month Rent (INR)"
              name="rentPerMonth"
              value={formData.rentPerMonth}
              onChange={handleChange}
              type="number"
              required
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.reasons.autoGenerate}
                  onChange={handleCheckboxChange}
                  name="autoGenerate"
                />
              }
              label="Auto Generate Reasons to Withhold Advance"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.reasons.setManually}
                  onChange={handleCheckboxChange}
                  name="setManually"
                />
              }
              label="Set Reasons Manually"
            />
          </Grid>
          {formData.reasons.setManually && (
            <Grid item xs={12}>
              {formData.manualReasons.map((reason, index) => (
                <div key={index} className={classes.keywordContainer}>
                  <TextField
                    fullWidth
                    label={`Reason ${index + 1}`}
                    value={reason}
                    onChange={(e) => handleKeywordChange(index, e.target.value)}
                    required
                  />
                  {index > 0 && (
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => removeKeywordField(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="contained"
                onClick={addKeywordField}
                className={classes.button}
              >
                Add Reason
              </Button>
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              select
              required
            >
              {[
                "Strongest protections for Owner",
                "Strongest protections for Renter",
                "Strongest protections for both",
              ].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submitButton}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Agreement;
