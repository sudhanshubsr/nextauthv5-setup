import React from "react";
import {auth} from "@/auth"
import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
const SettingsPage = async() => {
    const session = await auth()
  return <div>

    {JSON.stringify(session)}
    <form action={async()=>{
      "use server";
      await signOut();
    }}>
      <Button type="submit">
        SignOut
      </Button>
    </form>
  </div>;
};

export default SettingsPage;
