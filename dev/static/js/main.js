const siblings = node => Array.from(node.parentElement.children).filter(el => el !== node);
function changeSlide(slider, dir){
	const currentSlide = slider.querySelector('.active'),
		  currentIndexPlaceholder = slider.querySelector('.slider-pagination-current'),
		  prev = slider.querySelector('.slider-prev'),
		  next = slider.querySelector('.slider-next'),
		  newSlide = dir === "next" ? currentSlide.nextSibling : currentSlide.previousSibling,
		  newIndex = parseInt(newSlide.dataset.index, 10),
		  wrapper = slider.querySelector('.slides-list'),
		  slides = slider.querySelectorAll('.slide');


	currentSlide.classList.remove('active');
	newSlide.classList.add('active');
	wrapper.style.transform = `translateX(-${newIndex * 100}%)`;

	next && (newIndex === slides.length - 1 ? next.classList.add('disabled') : next.classList.remove('disabled'));
	prev && (newIndex === 0 ? prev.classList.add('disabled') : prev.classList.remove('disabled'));
	currentIndexPlaceholder && (currentIndexPlaceholder.innerHTML = newIndex + 1);

}

// tabs
const tabElement = document.querySelectorAll('.tabs');
tabElement.forEach(x=>{
	const control = x.querySelectorAll('.tabs-header li a');
	control.forEach(c=>{
		c.addEventListener('click', function(e){
			e.preventDefault();
			e.stopPropagation();

			const tab = e.target.parentElement,
				  tabParent = tab.closest('.tabs'),
				  tabId = tab.dataset.tab,
				  selectedTab = tabParent.querySelector(`.tab[data-tab='${tabId}']`);

			tab.classList.add('on')
			siblings(tab).map(el => el.classList.remove('on'));
			selectedTab.style.display = "block";
			siblings(selectedTab).map(el => el.style.display = "none");
		})
	})
	control[0].click();
})

// slideshow
const sliders = document.querySelectorAll('.slideshow');
sliders.forEach(slideshow => {
	const slides = slideshow.querySelectorAll('.slide'),
		  wrapper = document.createElement('div'),
		  controls = document.createElement('div'),
		  options = {
		controls: false,
		affects: false
	};


	wrapper.classList.add('slides-list')

	slideshow.dataset.controls && (options.controls = slideshow.dataset.controls);
	slideshow.dataset.affects && (options.affects = slideshow.dataset.affects);

	slideshow.appendChild(wrapper)

	slides.forEach((slide,i) => {
		slide.dataset.index=i;
		i === 0 && slide.classList.add('active');
		wrapper.appendChild(slide)
	})

	controls.classList.add('slider-controls');
	switch (options.controls){
		case 'controls':
			let controlsTemplate = `<div class="slider-controls-proper">
				<a href="" class="slider-control slider-prev disabled">
					<svg>
						<use xlink:href="static/images/sprite/symbol/sprite.svg#bwd"></use>
					</svg>
				</a>
				<span class="slider-pagination-current">1</span>
				—
				<span class="slider-pagination-total">${slides.length}</span>
				<a href="" class="slider-control slider-next">
					<svg>
						<use xlink:href="static/images/sprite/symbol/sprite.svg#fwd"></use>
					</svg>
				</a>
			</div>`;
			controls.innerHTML = controlsTemplate;
			break;
		default:
			break;
	}

	slideshow.appendChild(controls);

	const controlLinks = controls.querySelectorAll('.slider-control');

	controlLinks.forEach(link=>{
		link.addEventListener('click', function(e){
			e.preventDefault();
			const direction = link.classList.contains('slider-prev')?'prev':'next';

			changeSlide(slideshow, direction);
			if (options.affects) {
				const coslider = document.getElementById(options.affects);
				changeSlide(coslider, direction)
			}

		})
	})
})

// custom select
const select = document.querySelectorAll('.select-custom');
select.forEach(el => {
	const wrapper = document.createElement('div'),
		  options = el.querySelectorAll('option'),
		  template = `
	<div class="select-current">
		<div class="select-current-text">
			${Array.from(options).find(option=>option.attributes.selected).innerText}
		</div>
	</div>
	<div class="select-dropdown">
		<ul>
			${Array.from(options).map(option=>`<li><a href="" data-val="${option.value}" class="${option.attributes.selected?`selected`:``} ${option.attributes.disabled?`disabled`:``}">${option.innerText}</a></li>`).join('\n')}
		</ul>
	</div>`;
	el.parentNode.insertBefore(wrapper, el);
	wrapper
		.classList.add('select-customized')
	wrapper
		.appendChild(el)
		.insertAdjacentHTML('afterend', template);
	el.style.display = "none";

	const selected = wrapper.querySelector('.select-current'),
		  selectedText = wrapper.querySelector('.select-current-text'),
		  dropdown = wrapper.querySelector('.select-dropdown'),
		  variants = dropdown.querySelectorAll('a');

	selected.addEventListener('click', function(){
		this.parentElement.classList.add('opened')
	})

	document.addEventListener("click", (e) => {
	    const el = wrapper;
    	let targetEl = e.target; 
		do {
			if (targetEl == el) {
				return;
			}
			targetEl = targetEl.parentNode;
		} while (targetEl);
		wrapper.classList.remove('opened')
	});


	variants.forEach(variant => {
		variant.addEventListener('click', function(e){
			e.preventDefault();
			this.classList.add('selected');
			selectedText.innerHTML = this.innerHTML;
			wrapper.classList.remove('opened');
			el.value = this.dataset.val;
			siblings(this.parentElement).map(el => el.children[0].classList.remove('selected'));

			// perform some action here

		})
	})

})

// toggle navi on mobile
const navi = document.querySelector('.header-navi'),
	  naviCall = document.querySelector('.navi-toggle'),
	  naviClose = document.querySelector('.navi-close');

naviCall.addEventListener('click', function(e){
	e.preventDefault();
	navi.classList.add('called')
})

naviClose.addEventListener('click', function(e){
	e.preventDefault();
	navi.classList.remove('called')
})