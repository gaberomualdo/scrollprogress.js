const ScrollProgress = (options) => {
	const containerElement = document.body;

	// create progress bar container element within container element
	const progressBarContainerElement = document.createElement('div');
	progressBarContainerElement.setAttribute('id', uuidv4());
	progressBarContainerElement.setAttribute('style', `
	--progress-color: ${options.color || '#2188ff'};
	--progress-height: ${options.height || '10px'};
	position: fixed;
	left: 0;
	top: ${options.fromTop || '0'};
	width: 100%;
	height: var(--progress-height);
	`);

	// create progress bar element within progress bar container element
	const progressBarElement = document.createElement('div');
	progressBarElement.setAttribute('style', `
	height: var(--progress-height);
	background-color: var(--progress-color);
	width: 0%;
	float: left;
	`);

	// apply custom styles (if specified) to progress bar element
	if(options.customStyles) {
		Object.keys(options.customStyles).forEach((key) => {
			progressBarElement.style[key] = options.customStyles[key];
		});
	}

	// add elements to DOM
	progressBarContainerElement.appendChild(progressBarElement);
	containerElement.appendChild(progressBarContainerElement);

	// function to check scroll position and update scroll progress bar accordingly
	const update = () => {
		if(containerElement == document.body) {
			// get full scroll height
			const scrollHeight = containerElement.scrollHeight - window.innerHeight;
			
			// get current scroll position
			const scrollPosition = window.pageYOffset;

			// get scroll percentage and set width of progress bar
			let scrollPercentage = (scrollPosition / scrollHeight) * 100;
			scrollPercentage = scrollPercentage > 100 ? 100 : scrollPercentage;
			progressBarElement.style.width = scrollPercentage + '%';
		}else {
			// get full scroll height
			const scrollHeight = containerElement.scrollHeight - heightInViewport(containerElement);
			
			// get current scroll position
			const scrollPosition = containerElement.scrollTop;

			// get scroll percentage and set width of progress bar
			const scrollPercentage = (scrollPosition / scrollHeight) * 100;
			progressBarElement.style.width = scrollPercentage + '%';
		}
	}

	// bind window onload and onscroll events to update scroll progress bar width
	if(containerElement == document.body) {
		window.addEventListener('scroll', update);
	}else {
		containerElement.addEventListener('scroll', update);
	}
	window.addEventListener('load', update);

	// function to create random UUID
	// code taken from various users on https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	function uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	// function to get visible height in viewport
	// some code taken from user Roko C. Buljan on https://stackoverflow.com/questions/24768795/get-the-visible-height-of-a-div-with-jquery
	function heightInViewport(el) {
		const elH = el.offsetHeight;
		const H = document.body.offsetHeight;
		const r = el.getBoundingClientRect();
		const t=r.top;
		const b=r.bottom;
		return Math.max(0, t>0? Math.min(elH, H-t) : Math.min(b, H));
	}
}