import React from "react";
import "./Welcome.css";
import hearthstoneIcon from "../../assets/images/hearthstone-icon.png";
export default function Welcome() {
  return React.createElement(
    "div",
    { className: "welcome", "data-testid": "welcome-container" },
    React.createElement(
      "div",
      { className: "welcome-header-section", "data-testid": "welcome-header" },
      React.createElement("img", {
        className: "welcome-logo",
        src: hearthstoneIcon,
        alt: "Hearthstone Icon",
      }),
      React.createElement("h2", null, "Welcome")
    ),
    React.createElement(
      "p",
      null,
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et voluptas eligendi maiores beatae eius, odit aperiam, pariatur tenetur sequi quis doloribus perspiciatis neque voluptatem, consequuntur aliquid quam. Voluptatem perferendis ea reiciendis impedit similique cupiditate explicabo necessitatibus! Minima velit, praesentium rerum sed delectus excepturi, ducimus ipsum repudiandae suscipit ullam at consequuntur aliquid fuga iure dicta nisi ex sequi. Porro ipsum laborum ut velit nulla fugit officiis omnis, eos repudiandae saepe veniam molestiae. Enim officia aut nemo voluptatum ratione sapiente ipsa obcaecati cum, quas veritatis debitis quis odit quasi minus explicabo incidunt."
    ),
    React.createElement(
      "p",
      null,
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Et voluptas eligendi maiores beatae eius, odit aperiam, pariatur tenetur sequi quis doloribus perspiciatis neque voluptatem, consequuntur aliquid quam. Voluptatem perferendis ea reiciendis impedit similique cupiditate explicabo necessitatibus! Minima velit, praesentium rerum sed delectus excepturi, ducimus ipsum repudiandae suscipit ullam at consequuntur aliquid fuga iure dicta nisi ex sequi. Porro ipsum laborum ut velit nulla fugit officiis omnis, eos repudiandae saepe veniam molestiae. Enim officia aut nemo voluptatum ratione sapiente ipsa obcaecati cum, quas veritatis debitis quis odit quasi minus explicabo incidunt!"
    ),
    React.createElement(
      "p",
      null,
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Minus repudiandae reiciendis accusamus maxime dolor eum in sed quam hic sunt ad veniam architecto harum, dolorum eveniet distinctio provident nam at placeat asperiores! Eum veniam molestias ab odit, necessitatibus ipsa quam veritatis perferendis doloribus dicta voluptatibus voluptatum excepturi ullam quasi sed maxime quaerat qui consequuntur earum illo labore officiis nemo impedit facere. Veritatis numquam excepturi dolor vero rem. Voluptates eligendi ut voluptate. Ullam magni quisquam voluptatibus veniam autem? Sed iure ipsam odio vel porro distinctio vitae eum eos possimus ab, doloribus perspiciatis omnis ut impedit fugit earum voluptatem eligendi quidem voluptatum?"
    )
  );
}
