const loadScript = (src) => {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = src;
		script.onload = resolve;
		script.onerror = reject;
		document.head.appendChild(script);
	});
};

const ANIMATION_CONFIG = {
	PARTICLE_COUNT: 30,
	GLOW_DURATION: 1,
	FLOAT_DURATION: 2,
	TYPE_SPEED: 20,
	PACKET_SIZES: {
		traditional: 20,
		edge: 10,
	},
};

Promise.all([
	loadScript(
		"https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
	),
	loadScript(
		"https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
	),
]).then(() => {
	gsap.registerPlugin(ScrollTrigger);
	initAnimations();
});

function initAnimations() {
	initLightbulbAnimation();
	initArchitectureAnimations();
	initParticleSystem();
	initCodeBlockAnimations();
	initMetricCardAnimations();
	initInteractiveDemo();
}

function initLightbulbAnimation() {
	const lightbulb = document.querySelector(".highlight-icon");
	gsap.timeline({
		scrollTrigger: {
			trigger: ".highlight-box",
			start: "top center",
			toggleActions: "play none none reverse",
		},
	})
		.to(".highlight-box", {
			boxShadow: "0 0 30px rgba(76, 175, 80, 0.3)",
			duration: ANIMATION_CONFIG.GLOW_DURATION,
		})
		.to(
			lightbulb,
			{
				textShadow: "0 0 20px rgba(255, 255, 255, 0.8)",
				scale: 1.1,
				duration: 0.5,
				yoyo: true,
				repeat: -1,
			},
			"-=1"
		);
}

function initArchitectureAnimations() {
	gsap.to(".arch-component", {
		y: -10,
		duration: ANIMATION_CONFIG.FLOAT_DURATION,
		yoyo: true,
		repeat: -1,
		ease: "power1.inOut",
		stagger: {
			each: 0.3,
			from: "random",
		},
	});

	document.querySelectorAll(".arch-component").forEach(setupArchComponent);
}

function setupArchComponent(component) {
	const techDetails = component.querySelector(".tech-details");
	if (techDetails) {
		techDetails.style.opacity = "1";
		techDetails.style.visibility = "visible";
	}

	component.addEventListener("mousemove", handleMouseMove);
	animateTechItems(component);
	animateArchIcon(component);
}

function handleMouseMove(e) {
	const rect = e.currentTarget.getBoundingClientRect();
	const x = ((e.clientX - rect.left) / rect.width) * 100;
	const y = ((e.clientY - rect.top) / rect.height) * 100;
	e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
	e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
}

function animateTechItems(component) {
	const techItems = component.querySelectorAll(".tech-item");

	techItems.forEach((item) => {
		item.style.opacity = "1";
		item.style.transform = "translateX(0)";
	});

	if (window.gsap && window.ScrollTrigger) {
		try {
			gsap.from(techItems, {
				scrollTrigger: {
					trigger: component,
					start: "top center+=100",
					toggleActions: "play none none none",
					once: true,
					onEnter: () => {
						techItems.forEach((item) => {
							item.style.opacity = "1";
							item.style.transform = "translateX(0)";
						});
					},
				},
				x: -20,
				opacity: 0,
				duration: 0.8,
				stagger: 0.1,
				ease: "power2.out",
				onComplete: () => {
					techItems.forEach((item) => {
						item.style.opacity = "1";
						item.style.transform = "translateX(0)";
					});
				},
			});
		} catch (error) {
			console.warn(
				"Tech items animation failed, falling back to static display",
				error
			);
			techItems.forEach((item) => {
				item.style.opacity = "1";
				item.style.transform = "translateX(0)";
			});
		}
	}
}

function animateArchIcon(component) {
	gsap.to(component.querySelector(".arch-icon"), {
		scrollTrigger: {
			trigger: component,
			start: "top center+=100",
			toggleActions: "play none none none",
			once: true,
		},
		rotate: 360,
		duration: 1.5,
		ease: "power2.out",
	});
}

function initParticleSystem() {
	const container = document.querySelector(".demo-visualization");
	if (!container) return;

	const particles = Array.from(
		{ length: ANIMATION_CONFIG.PARTICLE_COUNT },
		() => {
			const particle = document.createElement("div");
			particle.className = "data-particle";
			container.appendChild(particle);

			gsap.set(particle, {
				position: "absolute",
				width: "4px",
				height: "4px",
				backgroundColor: "#4CAF50",
				borderRadius: "50%",
				x: 0,
				y: "50%",
			});

			return particle;
		}
	);

	particles.forEach(animateParticle);
}

function animateParticle(particle) {
	const duration = gsap.utils.random(2, 4);
	const delay = gsap.utils.random(0, 2);

	gsap.to(particle, {
		x: "100%",
		ease: "none",
		duration,
		delay,
		repeat: -1,
		onRepeat: () => {
			gsap.set(particle, {
				opacity: gsap.utils.random(0.3, 1),
				y: gsap.utils.random(20, 80) + "%",
			});
		},
	});
}

function initCodeBlockAnimations() {
	const tabBtns = document.querySelectorAll(".tab-btn");
	const traditionalCode = document.getElementById("traditionalCode");
	const edgeCode = document.getElementById("edgeCode");

	tabBtns.forEach((btn) => {
		btn.addEventListener("click", () => {
			tabBtns.forEach((b) => b.classList.remove("active"));
			btn.classList.add("active");

			if (btn.dataset.tab === "traditional") {
				traditionalCode.classList.remove("hidden");
				edgeCode?.classList.add("hidden");
			} else if (btn.dataset.tab === "edge") {
				traditionalCode.classList.add("hidden");
				edgeCode?.classList.remove("hidden");
			}
		});
	});

	document.querySelectorAll(".code-block").forEach((block) => {
		const text = block.textContent;
		block.textContent = "";

		const typeWriter = createTypeWriter(block, text);

		ScrollTrigger.create({
			trigger: block,
			start: "top center",
			onEnter: typeWriter,
		});
	});
}

function createTypeWriter(element, text) {
	let index = 0;
	return function type() {
		if (index < text.length) {
			element.textContent += text.charAt(index);
			index++;
			setTimeout(type, ANIMATION_CONFIG.TYPE_SPEED);
		}
	};
}

function initMetricCardAnimations() {
	gsap.from(".metric-card", {
		scrollTrigger: {
			trigger: ".performance-metrics",
			start: "top center",
			toggleActions: "play none none reverse",
		},
		y: 50,
		opacity: 0,
		duration: 0.8,
		stagger: 0.2,
	});
}

function initInteractiveDemo() {
	const elements = {
		traditionalBtn: document.getElementById("traditional"),
		edgeBtn: document.getElementById("edge"),
		latencyFill: document.querySelector(".latency-fill"),
		latencyValue: document.querySelector(".latency-value"),
		bandwidthFill: document.querySelector(".bandwidth-fill"),
		bandwidthValue: document.querySelector(".bandwidth-value"),
	};

	setTimeout(() => {
		elements.traditionalBtn.disabled = false;
		elements.edgeBtn.disabled = false;
	}, 1000);

	elements.traditionalBtn?.addEventListener("click", () =>
		simulateProcessing(elements, true)
	);
	elements.edgeBtn?.addEventListener("click", () =>
		simulateProcessing(elements, false)
	);
}

function createDataPacket(isTraditional) {
	const packet = document.createElement("div");
	packet.className = "data-packet";
	const container = document.querySelector(".data-packets");
	container.appendChild(packet);

	const size = isTraditional
		? ANIMATION_CONFIG.PACKET_SIZES.traditional
		: ANIMATION_CONFIG.PACKET_SIZES.edge;

	gsap.set(packet, {
		position: "absolute",
		width: `${size}px`,
		height: `${size}px`,
		background: isTraditional ? "#ff4444" : "#4CAF50",
		borderRadius: "50%",
		left: "0%",
		top: "50%",
		yPercent: -50,
		opacity: 0,
		zIndex: 1,
	});

	return packet;
}

function simulateProcessing(elements, isTraditional) {
	const btn = isTraditional ? elements.traditionalBtn : elements.edgeBtn;
	const spinner = btn.querySelector(".loading-spinner");
	const btnText = btn.querySelector(".btn-text");

	elements.traditionalBtn.disabled = true;
	elements.edgeBtn.disabled = true;
	spinner.classList.remove("hidden");
	btnText.style.opacity = "0.5";

	elements.latencyFill.style.width = "0%";
	elements.latencyValue.textContent = "0ms";
	elements.bandwidthFill.style.width = "0%";
	elements.bandwidthValue.textContent = "0 MB/s";

	document.querySelector(".camera-device").classList.add("active");

	const timeline = gsap.timeline({
		onComplete: () => {
			elements.traditionalBtn.disabled = false;
			elements.edgeBtn.disabled = false;
			spinner.classList.add("hidden");
			btnText.style.opacity = "1";
			document.querySelector(".camera-device").classList.remove("active");
			document.querySelector(".server-device").classList.remove("active");
		},
	});

	if (isTraditional) {
		const packetCount = 10;
		for (let i = 0; i < packetCount; i++) {
			const packet = createDataPacket(true);
			timeline.to(
				packet,
				{
					left: "100%",
					opacity: 1,
					duration: 2,
					ease: "none",
					onStart: () => {
						if (i === 0)
							document
								.querySelector(".server-device")
								.classList.add("active");
					},
					onComplete: () => packet.remove(),
				},
				i * 0.2
			);
		}

		timeline.to(
			[elements.latencyFill, elements.bandwidthFill],
			{
				width: "80%",
				duration: 0.5,
				ease: "power1.out",
			},
			0
		);

		timeline.to(
			elements.latencyValue,
			{
				duration: 2,
				onUpdate: () => {
					const progress = timeline.progress();
					elements.latencyValue.textContent = `${Math.round(
						progress * 500
					)}ms`;
				},
			},
			0
		);

		timeline.to(
			elements.bandwidthValue,
			{
				duration: 2,
				onUpdate: () => {
					const progress = timeline.progress();
					elements.bandwidthValue.textContent = `${(
						progress * 50
					).toFixed(1)} MB/s`;
				},
			},
			0
		);
	} else {
		const packet = createDataPacket(false);
		timeline.to(packet, {
			left: "100%",
			opacity: 1,
			duration: 0.5,
			ease: "none",
			onStart: () =>
				document
					.querySelector(".server-device")
					.classList.add("active"),
			onComplete: () => packet.remove(),
		});

		timeline.to(
			[elements.latencyFill, elements.bandwidthFill],
			{
				width: "20%",
				duration: 0.3,
				ease: "power1.out",
			},
			0
		);

		timeline.to(
			elements.latencyValue,
			{
				duration: 0.5,
				onUpdate: () => {
					const progress = timeline.progress();
					elements.latencyValue.textContent = `${Math.round(
						progress * 50
					)}ms`;
				},
			},
			0
		);

		timeline.to(
			elements.bandwidthValue,
			{
				duration: 0.5,
				onUpdate: () => {
					const progress = timeline.progress();
					elements.bandwidthValue.textContent = `${(
						progress * 5
					).toFixed(1)} MB/s`;
				},
			},
			0
		);
	}
}


function initImageEnhancementDemo() {
	const elements = {
		originalBtn: document.getElementById("original"),
		enhancedBtn: document.getElementById("enhanced"),
		originalImage: document.querySelector(".original-image"),
		enhancedImage: document.querySelector(".enhanced-image"),
	};

	setTimeout(() => {
		elements.originalBtn.disabled = false;
		elements.enhancedBtn.disabled = false;
	}, 1000);

	elements.originalBtn?.addEventListener("click", () =>
		toggleImage(elements, true)
	);
	elements.enhancedBtn?.addEventListener("click", () =>
		toggleImage(elements, false)
	);
}

function toggleImage(elements, isOriginal) {
	const btn = isOriginal ? elements.originalBtn : elements.enhancedBtn;
	const spinner = btn.querySelector(".loading-spinner");
	const btnText = btn.querySelector(".btn-text");

	elements.originalBtn.disabled = true;
	elements.enhancedBtn.disabled = true;
	spinner.classList.remove("hidden");
	btnText.style.opacity = "0.5";

	const timeline = gsap.timeline({
		onComplete: () => {
			elements.originalBtn.disabled = false;
			elements.enhancedBtn.disabled = false;
			spinner.classList.add("hidden");
			btnText.style.opacity = "1";
		},
	});

	if (isOriginal) {
		timeline.to(elements.enhancedImage, {
			opacity: 0,
			duration: 0.5,
			ease: "power1.out",
		});
		timeline.to(elements.originalImage, {
			opacity: 1,
			duration: 0.5,
			ease: "power1.out",
		}, "-=0.5");
	} else {
		timeline.to(elements.originalImage, {
			opacity: 0,
			duration: 0.5,
			ease: "power1.out",
		});
		timeline.to(elements.enhancedImage, {
			opacity: 1,
			duration: 0.5,
			ease: "power1.out",
		}, "-=0.5");
	}
}

setTimeout(() => {
	initImageEnhancementDemo();
}, 1000);

function initWeatherImageDemo() {
	const elements = {
		originalWeatherBtn: document.getElementById("original-weather"),
		dehazedBtn: document.getElementById("dehazed"),
		filteredBtn: document.getElementById("filtered"),
		originalWeatherImage: document.querySelector(".original-weather-image"),
		dehazedImage: document.querySelector(".dehazed-image"),
		filteredImage: document.querySelector(".filtered-image"),
	};

	setTimeout(() => {
		elements.originalWeatherBtn.disabled = false;
		elements.dehazedBtn.disabled = false;
		elements.filteredBtn.disabled = false;
	}, 1000);

	elements.originalWeatherBtn?.addEventListener("click", () =>
		toggleWeatherImage(elements, "originalWeather")
	);
	elements.dehazedBtn?.addEventListener("click", () =>
		toggleWeatherImage(elements, "dehazed")
	);
	elements.filteredBtn?.addEventListener("click", () =>
		toggleWeatherImage(elements, "filtered")
	);
}

function toggleWeatherImage(elements, type) {
	const btn = elements[`${type}Btn`];
	const spinner = btn.querySelector(".loading-spinner");
	const btnText = btn.querySelector(".btn-text");

	elements.originalWeatherBtn.disabled = true;
	elements.dehazedBtn.disabled = true;
	elements.filteredBtn.disabled = true;
	spinner.classList.remove("hidden");
	btnText.style.opacity = "0.5";

	const timeline = gsap.timeline({
		onComplete: () => {
			elements.originalWeatherBtn.disabled = false;
			elements.dehazedBtn.disabled = false;
			elements.filteredBtn.disabled = false;
			spinner.classList.add("hidden");
			btnText.style.opacity = "1";
		},
	});

	timeline.to(
		[elements.originalWeatherImage, elements.dehazedImage, elements.filteredImage],
		{
			opacity: 0,
			duration: 0.5,
			ease: "power1.out",
		}
	);

	timeline.to(
		elements[`${type}Image`],
		{
			opacity: 1,
			duration: 0.5,
			ease: "power1.out",
		},
		"-=0.5"
	);
}

setTimeout(() => {
	initWeatherImageDemo();
}, 1000);

function initEdgeDetectionDemo() {
	const elements = {
		originalEdgeBtn: document.getElementById("original-edge"),
		binarizedEdgeBtn: document.getElementById("binarized-edge"),
		originalEdgeImage: document.querySelector(".original-edgedet-image"),
		binarizedEdgeImage: document.querySelector(".binarized-edgedet-image"),
	};

	setTimeout(() => {
		elements.originalEdgeBtn.disabled = false;
		elements.binarizedEdgeBtn.disabled = false;
	}, 1000);

	elements.originalEdgeBtn?.addEventListener("click", () =>
		toggleEdgeImage(elements, true)
	);
	elements.binarizedEdgeBtn?.addEventListener("click", () =>
		toggleEdgeImage(elements, false)
	);
}

function toggleEdgeImage(elements, isOriginal) {
	const btn = isOriginal ? elements.originalEdgeBtn : elements.binarizedEdgeBtn;
	const spinner = btn.querySelector(".loading-spinner");
	const btnText = btn.querySelector(".btn-text");

	elements.originalEdgeBtn.disabled = true;
	elements.binarizedEdgeBtn.disabled = true;
	spinner.classList.remove("hidden");
	btnText.style.opacity = "0.5";

	const timeline = gsap.timeline({
		onComplete: () => {
			elements.originalEdgeBtn.disabled = false;
			elements.binarizedEdgeBtn.disabled = false;
			spinner.classList.add("hidden");
			btnText.style.opacity = "1";
		},
	});

	if (isOriginal) {
		timeline.to(elements.binarizedEdgeImage, {
			opacity: 0,
			duration: 0.5,
			ease: "power1.out",
		});
		timeline.to(elements.originalEdgeImage, {
			opacity: 1,
			duration: 0.5,
			ease: "power1.out",
		}, "-=0.5");
	} else {
		timeline.to(elements.originalEdgeImage, {
			opacity: 0,
			duration: 0.5,
			ease: "power1.out",
		});
		timeline.to(elements.binarizedEdgeImage, {
			opacity: 1,
			duration: 0.5,
			ease: "power1.out",
		}, "-=0.5");
	}
}

setTimeout(() => {
	initEdgeDetectionDemo();
}, 1000);