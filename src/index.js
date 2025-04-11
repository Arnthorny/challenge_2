// const storage = require("./models/file_storage");

const { User, storage, Session } = require("./models");

async function main() {
  await storage.reload();

  const user_details = {
    firstName: "Test",
    lastName: "User",
    email: "test_user@mail.com",
    password: "Test123",
    address: "12, Oshodi road",
    bio: "Works daily",
    occupation: "Frontend dev",
    expertise: "React",
  };

  const session_details = {
    mentorId: "123",
    menteeId: "234",
    questions: "Whoo?",
    menteeEmail: "mentee@email.com",
  };

  const u = await User.create(user_details);
  const s = await Session.create(session_details);

  u.role = "mentor";
  u.save();

  const all_s = User.filter_by({ id: 1, role: "mentor" });
  console.log(all_s);

  await storage.close();
}
main();
