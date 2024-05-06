# study-notion-project
I created my first complete backend application for studyNotion using Node Js, Express Js, and Mongo DB from Love Babbar's Code Help Web Dev course.

In this application, users can create accounts as students or instructors. The user will receive the OTP via email. Users can log in, and if their password is lost, a recovery email link will be issued to their respective email addresses. Where a link is generated, and the user can update their password. The user can then update the further profile details, such as the profile photo, date of birth, gender, and about section. For this section, data is received from the client and transferred to the server. Here, students can purchase courses and enrol in them.

The user can also view all available courses with tags and add them to their cart. They can also view the enrolled courses on their dashboard. If the person wishes to delete their account, they can do so permanently. The user can also provide ratings and reviews for a specific course.

The other type of user is a teacher, who can develop a new course from an existing tag such as WebDev, AI, and many more... An instructor can also build sections and subsections within a course. In this course, they have control over the price and description. They can also view the number of pupils enrolled. In the subheading, they can provide videos of their lectures as well as a thumbnail of the course.

I've also handled protected routes for administrators, students, and instructors, where they can only access the one for which they are authenticated and authorised. Once logged in, the user does not need to log in again because the data is stored in the token for authentication and permission purposes.
