import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { SignUpSchema } from "@/schemas/SignUpSchema";
import { UsernameSchema } from "@/schemas/SignUpSchema";
import bcrypt from "bcryptjs";

async function extractAndGenerateUniqueUsername(username: string) {
  // Validate and transform the input username
  const parsedUsername = UsernameSchema.parse(username);

  // Extract root username by removing all digits and underscores (preserving the order)
  const rootUsername = parsedUsername.replace(/[0-9_]/g, "");

  if (!rootUsername) {
    throw new Error(
      "Invalid username format. Root username cannot be extracted."
    );
  }

  // Ensure root username has at least 2 characters
  if (rootUsername.length < 2) {
    throw new Error("Root username must be at least 2 characters.");
  }

  while (true) {
    const randomNum = Math.floor(Math.random() * 100000);

    // Randomly choose one of the two formats
    let suggestion =
      Math.random() > 0.5
        ? `${rootUsername}_${randomNum}`
        : `${rootUsername}${randomNum}`;

    // Enforce max length of 20 characters
    if (suggestion.length > 20) {
      suggestion = suggestion.slice(0, 20);
    }

    // Validate final suggestion with UsernameSchema
    suggestion = UsernameSchema.parse(suggestion);

    const userExists = await UserModel.findOne({ username: suggestion });
    if (!userExists) return suggestion;
  }
}

const signUp = async (request: Request) => {
  await dbConnect();

  try {
    const body = await request.json();
    const validation = SignUpSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        {
          success: false,
          message:
            "(user registration failed) please provide valid credentials for the registration process",
        },
        { status: 400 }
      );
    }

    const { username, email, password, firstname, lastname } = validation.data;

    const ExistingUserByUsername = await UserModel.findOne({ username });
    if (ExistingUserByUsername) {
      if (ExistingUserByUsername.isVerified) {
        return Response.json(
          {
            success: false,
            message: "username is already taken",
          },
          { status: 409 }
        );
      }

      (ExistingUserByUsername.username =
        await extractAndGenerateUniqueUsername(username)),
        await ExistingUserByUsername.save();
    }

    const ExistingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(Math.random() * 9000 + 100000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (ExistingUserByEmail) {
      if (ExistingUserByEmail.isVerified) {
        const passwordCheck = await bcrypt.compare(
          password,
          ExistingUserByEmail.password
        );
        return Response.json(
          {
            success: false,
            message: passwordCheck
              ? "User already exists, try login"
              : "User already exists, try logging in with correct password, we see a mismatch with your password",
          },
          { status: 500 }
        );
      }

      ExistingUserByEmail.username = username;
      ExistingUserByEmail.firstname = firstname;
      if (lastname) {
        ExistingUserByEmail.lastname = lastname;
      }
      ExistingUserByEmail.password = hashedPassword;
      ExistingUserByEmail.verifyCode = verifyCode;
      ExistingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;
      await ExistingUserByEmail.save();
    } else {
      await UserModel.create({
        firstname,
        if(lastname: string) {
          lastname;
        },
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        verifyCode,
        verifyCodeExpiry,
        premiumTaken: false,
      });
    }

    const response = await sendVerificationEmail(username, verifyCode, email);

    return Response.json(
      {
        success: response.success,
        message: response.message,
      },
      { status: response.success ? 200 : 500 }
    );
  } catch (error) {
    console.error("error occured while registering the user ", error);
    return Response.json(
      {
        success: false,
        message: "error occured while registering the user",
      },
      { status: 500 }
    );
  }
};


export {signUp as POST}