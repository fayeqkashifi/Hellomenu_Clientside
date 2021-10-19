# Laravel React CSRF Input Component

A React component for Laravel that accepts a CSRF token and adds a hidden input to your form containing it.

## Install
`npm i @ueaweb/laravel-react-csrf-input`

## Usage

In your <head> element .blade.php
```html
<meta name="csrf-token" content="{{ csrf_token() }}">
```

In your JS
```jsx
import React from "react";
import CSRFInput from "@ueaweb/laravel-react-csrf-input";

const Form = () => {
	const myToken = document.head.querySelector('meta[name="csrf-token"]').getAttribute('content');
	
	return (
		<form method="POST">
			<CSRFInput token={myToken}>
		</form>
	);
};
```
