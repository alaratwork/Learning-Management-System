// src/app/(Kambaz)/kambaz-homepage-layout.tsx file
/* Should be responsisble for the layout of the main Kambaz navigation sidebar:
- contains Account, Dashboard, Courses, Calendar and Inbox
*/
"use client";
import { ReactNode } from "react";
import KambazNavigation from "./kambaz-homepage-navigation";
import "./styles.css";
import store from "./store";
import { Provider } from "react-redux";
import Session from "./Account/Session";

export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Provider store={store}>
      <Session>
        <div className="d-flex" id="wd-kambaz">
          <div>
            <KambazNavigation />
          </div>
          <div className="flex-fill ps-3 wd-main-content-offset">
            {children}
          </div>
        </div>
      </Session>
    </Provider>
  );
}
