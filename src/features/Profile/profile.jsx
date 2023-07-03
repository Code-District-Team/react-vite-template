import { Card } from "antd";
import React from "react";

function ProfilePage() {
  // Profile data state
  const [profileData, setProfileData] = React.useState({
    name: "",
    email: "",
    bio: "",
    // Add more fields as needed
  });

  // Event handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform any necessary actions with the profile data
    console.log(profileData);
  };

  // Event handler for input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <Card>
        <div>
          <h1>Profile Page</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="bio">Bio:</label>
              <textarea
                id="bio"
                name="bio"
                value={profileData.bio}
                onChange={handleInputChange}
              ></textarea>
            </div>
            {/* Add more fields as needed */}
            <button type="submit">Save</button>
          </form>
        </div>
      </Card>
    </>
  );
}

export default ProfilePage;
